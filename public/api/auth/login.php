<?php
// public/api/auth/login.php

// 1. CORS & Headers
$allowed_origins = [
    "http://localhost:8083",
    "https://bharatxr.edtech-community.com",
    "https://bharatxr.co"
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

require_once '../../config/db.php';

// Helper: Get Client IP
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
    return $_SERVER['REMOTE_ADDR'];
}

// Helper: Trigger Password Reset Email (Internal Logic)
function triggerAutoReset($conn, $userId, $email) {
    // Generate Token
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Update User: Lock Account & Set Token
    $stmt = $conn->prepare("UPDATE users SET is_locked = 1, locked_at = NOW(), reset_token = ?, reset_expiry = ? WHERE user_id = ?");
    $stmt->execute([$token, $expiry, $userId]);

    // Simulate Sending Email (Replace with real mailer in production)
    $resetLink = "http://localhost:5173/reset-password?token=$token";
    error_log(" [SECURITY ALERT] Account Locked for $email. Auto-Reset Link: $resetLink");

    return $resetLink; // Only for dev/logging, don't send to frontend in production
}

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['identifier']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Credentials required']);
    exit;
}

$identifier = trim($input['identifier']);
$password = $input['password'];
$ip = getClientIP();

try {
    // =================================================================
    // LAYER 1: IP RATE LIMITING (Block for 1 Min)
    // =================================================================

    // Check if IP is currently blocked
    $stmtIp = $conn->prepare("SELECT attempts, blocked_until FROM ip_rate_limits WHERE ip_address = ?");
    $stmtIp->execute([$ip]);
    $ipRecord = $stmtIp->fetch(PDO::FETCH_ASSOC);

    if ($ipRecord && $ipRecord['blocked_until'] && strtotime($ipRecord['blocked_until']) > time()) {
        http_response_code(429); // Too Many Requests
        $wait = strtotime($ipRecord['blocked_until']) - time();
        echo json_encode(['status' => 'error', 'message' => "Too many attempts. IP blocked. Try again in $wait seconds."]);
        exit;
    }

    // =================================================================
    // LAYER 2: USER ACCOUNT CHECK
    // =================================================================

    // Clean Phone logic
    $cleanIdentifier = $identifier;
    if (is_numeric(str_replace(['+', ' ', '-'], '', $identifier))) {
         $cleanIdentifier = substr(preg_replace('/\D/', '', $identifier), -10);
    }

    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, password_hash, user_type, failed_attempts, is_locked FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$identifier, $cleanIdentifier]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // User not found - Generic error to prevent enumeration
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        exit;
    }

    // CHECK IF ACCOUNT IS PERMANENTLY LOCKED
    if ($user['is_locked'] == 1) {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Account is locked due to multiple failed attempts. Please check your email to reset your password.']);
        exit;
    }

    // =================================================================
    // LAYER 3: PASSWORD VERIFICATION
    // =================================================================

    if (password_verify($password, $user['password_hash'])) {
        // --- SUCCESS ---

        // 1. Reset IP Failures
        $conn->prepare("DELETE FROM ip_rate_limits WHERE ip_address = ?")->execute([$ip]);

        // 2. Reset User Failures
        $conn->prepare("UPDATE users SET failed_attempts = 0, is_locked = 0 WHERE user_id = ?")->execute([$user['user_id']]);

        // 3. Login Session
        if (session_status() === PHP_SESSION_NONE) session_start();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_type'] = $user['user_type'];

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'redirect' => '/dashboard',
            'user' => [
                'user_id' => $user['user_id'],
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'email' => $user['email'],
                'role' => $user['user_type']
            ]
        ]);

    } else {
        // --- FAILURE ---

        // 1. Handle IP Tracking (Increment or Block)
        if ($ipRecord) {
            $newAttempts = $ipRecord['attempts'] + 1;
            if ($newAttempts >= 5) {
                // BLOCK IP for 1 Minute
                $blockUntil = date('Y-m-d H:i:s', strtotime('+1 minute'));
                $conn->prepare("UPDATE ip_rate_limits SET attempts = ?, blocked_until = ? WHERE ip_address = ?")->execute([$newAttempts, $blockUntil, $ip]);
            } else {
                $conn->prepare("UPDATE ip_rate_limits SET attempts = attempts + 1 WHERE ip_address = ?")->execute([$ip]);
            }
        } else {
            $conn->prepare("INSERT INTO ip_rate_limits (ip_address, attempts) VALUES (?, 1)")->execute([$ip]);
        }

        // 2. Handle User Account Locking
        $newFailCount = $user['failed_attempts'] + 1;

        if ($newFailCount >= 5) {
            // !!! LOCK ACCOUNT & TRIGGER RESET !!!
            triggerAutoReset($conn, $user['user_id'], $user['email']);

            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Maximum attempts reached. Account has been locked. A password reset link has been sent to your email.']);
        } else {
            // Just increment counter
            $conn->prepare("UPDATE users SET failed_attempts = ? WHERE user_id = ?")->execute([$newFailCount, $user['user_id']]);

            $remaining = 5 - $newFailCount;
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => "Invalid password. You have $remaining attempts remaining."]);
        }
    }

} catch (PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>