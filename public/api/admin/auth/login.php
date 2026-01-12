<?php
// public/api/admin/auth/login.php
require_once '../../config/db.php';

// Helper function to send reset email
function sendAutoResetLink($conn, $email) {
    try {
        // Generate Token
        $token = bin2hex(random_bytes(32));
        $token_hash = hash('sha256', $token);
        $expiry = date("Y-m-d H:i:s", strtotime("+30 minutes"));

        $update = $conn->prepare("UPDATE admins SET reset_token_hash = :hash, reset_token_expires_at = :expiry WHERE email = :email");
        $update->execute([':hash' => $token_hash, ':expiry' => $expiry, ':email' => $email]);

        $resetLink = "https://bharatxr.edtech-community.com/bharatxrpannelpanneladmin/reset?token=$token&email=" . urlencode($email);

        $subject = "Security Alert: Account Locked - BharatXR";
        $message = "Your admin account has been locked due to 5 failed login attempts.\n\nTo unlock your account, please reset your password immediately:\n$resetLink";
        $headers = "From: no-reply@edtech-community.com\r\n";
        $headers .= "Reply-To: no-reply@edtech-community.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        mail($email, $subject, $message, $headers);
    } catch (Exception $e) {
        // Fail silently or log error, don't stop execution
        error_log("Mail Error: " . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); exit();
}

$data = json_decode(file_get_contents("php://input"));
$email = trim($data->email ?? '');
$password = $data->password ?? '';
$ip_address = $_SERVER['REMOTE_ADDR'];

try {
    // ==========================================
    // 1. RATE LIMIT CHECK (5 attempts per minute per IP)
    // ==========================================

    // Clear old logs first
    $conn->exec("DELETE FROM rate_limits WHERE attempt_time < (NOW() - INTERVAL 1 MINUTE)");

    // Count attempts
    $stmt = $conn->prepare("SELECT COUNT(*) FROM rate_limits WHERE ip_address = :ip AND attempt_time > (NOW() - INTERVAL 1 MINUTE)");
    $stmt->execute([':ip' => $ip_address]);
    $attempts_in_last_minute = $stmt->fetchColumn();

    if ($attempts_in_last_minute >= 5) {
        http_response_code(429); // Too Many Requests
        echo json_encode([
            "status" => "error",
            "message" => "Too many login attempts. You are blocked for 1 minute."
        ]);
        exit();
    }

    // Record this attempt
    $logStmt = $conn->prepare("INSERT INTO rate_limits (ip_address) VALUES (:ip)");
    $logStmt->execute([':ip' => $ip_address]);

    // ==========================================
    // 2. CREDENTIAL CHECK
    // ==========================================

    $query = "SELECT admin_id, full_name, email, password_hash, role, is_permanent, status, failed_login_attempts, is_locked
              FROM admins WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // --- NEW STRICT CASE CHECK ---
        // MySQL is case-insensitive by default, so we must check PHP side.
        if ($row['email'] !== $email) {
            http_response_code(401);
            echo json_encode([
                "status" => "error",
                "message" => "Invalid credentials (Check email capitalization)"
            ]);
            exit();
        }

        // A. Check if Account is Locked
        if ($row['is_locked']) {
            http_response_code(403);
            echo json_encode([
                "status" => "error",
                "message" => "Account is locked due to repeated failures. Check your email to reset password and unlock."
            ]);
            exit();
        }

        // B. Verify Password
        if (password_verify($password, $row['password_hash'])) {
            // --- SUCCESS ---

            // 1. Reset failed attempts & Unlock
            $resetSql = "UPDATE admins SET failed_login_attempts = 0, is_locked = 0, last_login = NOW() WHERE admin_id = :id";
            $conn->prepare($resetSql)->execute([':id' => $row['admin_id']]);

            // 2. Start Secure Session
            session_start();
            $_SESSION['admin_id'] = $row['admin_id'];
            $_SESSION['role'] = $row['role'];
            $_SESSION['last_activity'] = time();

            echo json_encode([
                "status" => "success",
                "user" => [
                    "id" => $row['admin_id'],
                    "name" => $row['full_name'],
                    "email" => $row['email'],
                    "role" => $row['role'],
                    "last_login_ist" => date("Y-m-d H:i:s")
                ]
            ]);

        } else {
            // --- FAILURE ---

            $new_failures = $row['failed_login_attempts'] + 1;

            // Update failure count
            $failSql = "UPDATE admins SET failed_login_attempts = :fails WHERE admin_id = :id";
            $conn->prepare($failSql)->execute([':fails' => $new_failures, ':id' => $row['admin_id']]);

            // Check if limit reached (5 times)
            if ($new_failures >= 5) {
                // LOCK ACCOUNT
                $conn->prepare("UPDATE admins SET is_locked = 1 WHERE admin_id = :id")->execute([':id' => $row['admin_id']]);

                // SEND AUTO RESET EMAIL
                sendAutoResetLink($conn, $email);

                http_response_code(403);
                echo json_encode([
                    "status" => "error",
                    "message" => "Account LOCKED. 5 wrong attempts. A reset link has been sent to your email."
                ]);
            } else {
                http_response_code(401);
                $remaining = 5 - $new_failures;
                echo json_encode([
                    "status" => "error",
                    "message" => "Invalid password. $remaining attempts remaining before lock."
                ]);
            }
        }
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "System error."]);
}
?>