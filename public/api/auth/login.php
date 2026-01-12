<?php
// public/api/auth/login.php

// 1. CORS & Headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
header('Content-Type: application/json');

// Start Session for persistent login
session_start();

require_once '../../config/db.php';

function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

// 2. Get Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) sendError("Invalid JSON input");

if (empty($input['identifier']) || empty($input['password'])) {
    sendError("Email/Phone and Password are required");
}

$identifier = trim($input['identifier']);
$password = $input['password'];

try {
    // 3. Find User (By Email OR Phone)
    // We assume phone is stored as 10 digits in DB.
    // If user enters +91, we strip it.
    $cleanPhone = preg_replace('/\D/', '', $identifier);
    if (strlen($cleanPhone) > 10) $cleanPhone = substr($cleanPhone, -10);

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1");
    $stmt->execute([$identifier, $cleanPhone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendError("Invalid credentials", 401);
    }

    // 4. Verify Password
    if (!password_verify($password, $user['password_hash'])) {
        sendError("Invalid credentials", 401);
    }

    if (!$user['is_active']) {
        sendError("Account is inactive. Please contact support.", 403);
    }

    // 5. Fetch Profile Specifics (Optional, but good for Dashboard)
    $profileData = [];
    $userType = $user['user_type'];

    if ($userType === 'school') {
        $stmtP = $conn->prepare("
            SELECT p.*, d.school_name
            FROM profiles_school p
            JOIN directory_schools d ON p.school_id = d.school_id
            WHERE p.user_id = ?
        ");
        $stmtP->execute([$user['user_id']]);
        $profileData = $stmtP->fetch(PDO::FETCH_ASSOC);

    } elseif ($userType === 'undergraduate') {
        $stmtP = $conn->prepare("
            SELECT p.*, d.college_name
            FROM profiles_undergrad p
            JOIN directory_colleges_ug d ON p.college_id = d.college_id
            WHERE p.user_id = ?
        ");
        $stmtP->execute([$user['user_id']]);
        $profileData = $stmtP->fetch(PDO::FETCH_ASSOC);

    } elseif ($userType === 'graduate') {
        $stmtP = $conn->prepare("
            SELECT p.*, d.college_name
            FROM profiles_graduate p
            JOIN directory_colleges_pg d ON p.college_id = d.college_id
            WHERE p.user_id = ?
        ");
        $stmtP->execute([$user['user_id']]);
        $profileData = $stmtP->fetch(PDO::FETCH_ASSOC);

    } elseif ($userType === 'professional') {
        $stmtP = $conn->prepare("SELECT * FROM profiles_professional WHERE user_id = ?");
        $stmtP->execute([$user['user_id']]);
        $profileData = $stmtP->fetch(PDO::FETCH_ASSOC);
    }

    // 6. Set Session & Return Success
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['role'] = $user['user_type'];
    $_SESSION['name'] = $user['first_name'] . ' ' . $user['last_name'];

    // Determine Redirect URL
    $dashboardUrl = '/student/dashboard'; // Default
    if ($userType === 'professional') $dashboardUrl = '/pro/dashboard';

    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'user' => [
            'id' => $user['user_id'],
            'name' => $user['first_name'] . ' ' . $user['last_name'],
            'email' => $user['email'],
            'role' => $userType,
            'institution' => $profileData['school_name'] ?? $profileData['college_name'] ?? $profileData['job_role'] ?? 'N/A'
        ],
        'redirect' => $dashboardUrl
    ]);

} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    sendError("Login failed due to server error", 500);
}
?>