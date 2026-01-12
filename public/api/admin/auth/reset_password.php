<?php
// public/api/admin/auth/reset_password.php
require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["status" => "error", "message" => "Method not allowed"]));
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->token) || !isset($data->email) || !isset($data->new_password)) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "Missing required fields"]));
}

$email = $data->email;
$token_input = $data->token;
$new_password = $data->new_password;

// 1. Re-create the hash to compare
$token_hash = hash('sha256', $token_input);

try {
    // 2. Validate Token & Expiry
    $stmt = $conn->prepare("SELECT admin_id FROM admins
                           WHERE email = :email
                           AND reset_token_hash = :hash
                           AND reset_token_expires_at > NOW()");

    $stmt->execute([
        ':email' => $email,
        ':hash' => $token_hash
    ]);

    if ($stmt->rowCount() > 0) {
        // 3. Update Password & Unlock Account
        // - Sets new password hash
        // - Clears reset token
        // - Unlocks the account (is_locked = 0)
        // - Resets failed attempts counter (failed_login_attempts = 0)
        // - Increments audit log (password_change_count)

        $new_hash = password_hash($new_password, PASSWORD_BCRYPT);

        $update = $conn->prepare("UPDATE admins
                                 SET password_hash = :pass,
                                     reset_token_hash = NULL,
                                     reset_token_expires_at = NULL,
                                     is_locked = 0,
                                     failed_login_attempts = 0,
                                     password_change_count = password_change_count + 1
                                 WHERE email = :email");

        $update->execute([
            ':pass' => $new_hash,
            ':email' => $email
        ]);

        echo json_encode(["status" => "success", "message" => "Password updated successfully. Account unlocked."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB Error: " . $e->getMessage()]);
}
?>