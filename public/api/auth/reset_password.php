<?php
// public/api/auth/reset_password.php

require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? '';
$newPassword = $input['password'] ?? '';

if (!$token || !$newPassword) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

try {
    // 1. Verify Token & Expiry
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE reset_token = ? AND reset_expiry > NOW()");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token']);
        exit;
    }

    // 2. Update Password AND UNLOCK Account
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    // We explicitly set is_locked = 0 and failed_attempts = 0 here
    $update = $conn->prepare("UPDATE users
                              SET password_hash = ?,
                                  reset_token = NULL,
                                  reset_expiry = NULL,
                                  is_locked = 0,
                                  failed_attempts = 0
                              WHERE user_id = ?");

    $update->execute([$hash, $user['user_id']]);

    echo json_encode(['status' => 'success', 'message' => 'Password updated. Your account has been unlocked.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>