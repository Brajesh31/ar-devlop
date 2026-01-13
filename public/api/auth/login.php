<?php
// public/api/auth/login.php

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

// Disable HTML error output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// --- FIX: Correct Path to DB ---
if (file_exists(__DIR__ . '/../config/db.php')) {
    require_once __DIR__ . '/../config/db.php';
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database configuration file missing.']);
    exit;
}

// Helper: Get Client IP
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
    return $_SERVER['REMOTE_ADDR'];
}

// Helper: Trigger Password Reset Email
function triggerAutoReset($conn, $userId, $email) {
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $conn->prepare("UPDATE users SET is_locked = 1, locked_at = NOW(), reset_token = ?, reset_expiry = ? WHERE user_id = ?");
    $stmt->execute([$token, $expiry, $userId]);

    $resetLink = "https://bharatxr.edtech-community.com/reset-password?token=$token";
    error_log("SECURITY ALERT: Account Locked for $email. Auto-Reset Link: $resetLink");
    return $resetLink;
}

// 2. INPUT HANDLING
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

// FIX: Check for 'identifier' (Frontend) OR 'email' (Fallback)
$identifier = null;
if (!empty($input['identifier'])) {
    $identifier = trim($input['identifier']);
} elseif (!empty($input['email'])) {
    $identifier = trim($input['email']);
}

if (empty($identifier) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Email/Phone and Password are required.']);
    exit;
}

$password = $input['password'];
$ip = getClientIP();

try {
    // =================================================================
    // LAYER 1: IP RATE LIMITING
    // =================================================================
    $stmtIp = $conn->prepare("SELECT attempts, blocked_until FROM ip_rate_limits WHERE ip_address = ?");
    $stmtIp->execute([$ip]);
    $ipRecord = $stmtIp->fetch(PDO::FETCH_ASSOC);

    if ($ipRecord && $ipRecord['blocked_until'] && strtotime($ipRecord['blocked_until']) > time()) {
        http_response_code(429);
        $wait = strtotime($ipRecord['blocked_until']) - time();
        echo json_encode(['status' => 'error', 'message' => "Too many attempts. IP blocked. Try again in $wait seconds."]);
        exit;
    }

    // =================================================================
    // LAYER 2: USER ACCOUNT CHECK
    // =================================================================

    // Determine if identifier is Phone or Email
    $cleanIdentifier = $identifier;
    // Remove non-numeric chars to check if it's a phone number
    if (is_numeric(str_replace(['+', ' ', '-'], '', $identifier))) {
         $cleanIdentifier = substr(preg_replace('/\D/', '', $identifier), -10);
    }

    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, password_hash, user_type, failed_attempts, is_locked FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$identifier, $cleanIdentifier]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        exit;
    }

    if ($user['is_locked'] == 1) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Account locked. Please check your email to reset password.']);
        exit;
    }

    // =================================================================
    // LAYER 3: PASSWORD VERIFICATION
    // =================================================================

    if (password_verify($password, $user['password_hash'])) {
        // --- SUCCESS ---

        $conn->prepare("DELETE FROM ip_rate_limits WHERE ip_address = ?")->execute([$ip]);
        $conn->prepare("UPDATE users SET failed_attempts = 0, is_locked = 0 WHERE user_id = ?")->execute([$user['user_id']]);

        if (session_status() === PHP_SESSION_NONE) session_start();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_type'] = $user['user_type'];

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                            'user_id' => $user['user_id'],
                            'name' => $user['first_name'] . ' ' . $user['last_name'], // ✅ ADD THIS LINE
                            'first_name' => $user['first_name'],
                            'last_name' => $user['last_name'],
                            'email' => $user['email'],
                            'role' => $user['user_type'], // ✅ Ensure this matches your frontend 'AuthUser' type
                            'user_type' => $user['user_type']
                        ]
        ]);

    } else {
        // --- FAILURE ---

        // 1. IP Tracking
        if ($ipRecord) {
            $newAttempts = $ipRecord['attempts'] + 1;
            if ($newAttempts >= 5) {
                $blockUntil = date('Y-m-d H:i:s', strtotime('+1 minute'));
                $conn->prepare("UPDATE ip_rate_limits SET attempts = ?, blocked_until = ? WHERE ip_address = ?")->execute([$newAttempts, $blockUntil, $ip]);
            } else {
                $conn->prepare("UPDATE ip_rate_limits SET attempts = attempts + 1 WHERE ip_address = ?")->execute([$ip]);
            }
        } else {
            $conn->prepare("INSERT INTO ip_rate_limits (ip_address, attempts) VALUES (?, 1)")->execute([$ip]);
        }

        // 2. User Account Locking
        $newFailCount = ($user['failed_attempts'] ?? 0) + 1;

        if ($newFailCount >= 5) {
            triggerAutoReset($conn, $user['user_id'], $user['email']);
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Maximum attempts reached. Account locked.']);
        } else {
            $conn->prepare("UPDATE users SET failed_attempts = ? WHERE user_id = ?")->execute([$newFailCount, $user['user_id']]);
            $remaining = 5 - $newFailCount;
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => "Invalid password. $remaining attempts remaining."]);
        }
    }

} catch (Exception $e) {
    error_log("LOGIN ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>