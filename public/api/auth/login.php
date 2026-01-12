<?php
// public/api/auth/login.php

// 1. CORS & Security Headers
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
header('Content-Type: application/json');

require_once '../../config/db.php';

// 2. Get Input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['identifier']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Email/Phone and Password are required']);
    exit;
}

$identifier = trim($input['identifier']);
$password = $input['password'];

// Clean phone number if user entered one (remove +91, spaces, etc.)
// This ensures "+91 98765 43210" matches "9876543210" in DB
$cleanIdentifier = $identifier;
if (is_numeric(str_replace(['+', ' ', '-'], '', $identifier))) {
     $cleanIdentifier = substr(preg_replace('/\D/', '', $identifier), -10);
}

try {
    // 3. Find User (Check Email OR Phone)
    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, phone, password_hash, user_type
                           FROM users
                           WHERE email = ? OR phone = ?");

    // We try both the original input (for email) and the cleaned version (for phone)
    $stmt->execute([$identifier, $cleanIdentifier]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 4. Verify Password
    if ($user && password_verify($password, $user['password_hash'])) {

        // A. Start Session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_type'] = $user['user_type'];
        $_SESSION['email'] = $user['email'];

        // B. Return Success & User Data (For Frontend State)
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'redirect' => '/dashboard', // Helper for frontend redirect
            'user' => [
                'user_id' => $user['user_id'],
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'email' => $user['email'],
                'role' => $user['user_type']
            ]
        ]);

    } else {
        // Invalid Credentials
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'Invalid email/phone or password']);
    }

} catch (PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>