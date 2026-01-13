<?php
// public/api/auth/reset_password.php

// 1. CORS & Headers
$allowed_origins = [
    "http://localhost:5173",
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

// Disable HTML errors to prevent breaking JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// --- FIX: Correct Path to DB (Up 1 level, not 2) ---
if (file_exists(__DIR__ . '/../config/db.php')) {
    require_once __DIR__ . '/../config/db.php';
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database configuration file missing.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? '';
$newPassword = $input['password'] ?? '';

if (!$token || !$newPassword) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request. Token and Password required.']);
    exit;
}

try {
    // 1. Verify Token & Expiry
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE reset_token = ? AND reset_expiry > NOW()");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token. Please request a new link.']);
        exit;
    }

    // 2. Update Password AND UNLOCK Account
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    // We explicitly set is_locked = 0 and failed_attempts = 0 here
    // This ensures the user can log in immediately after fixing their password.
    $update = $conn->prepare("UPDATE users
                              SET password_hash = ?,
                                  reset_token = NULL,
                                  reset_expiry = NULL,
                                  is_locked = 0,
                                  failed_attempts = 0
                              WHERE user_id = ?");

    $update->execute([$hash, $user['user_id']]);

    echo json_encode(['status' => 'success', 'message' => 'Password updated successfully. Your account has been unlocked.']);

} catch (PDOException $e) {
    error_log("RESET PASS ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>