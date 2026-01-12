<?php
// public/api/auth/register.php

// 1. HEADERS & CONFIG
// --------------------------------------------------
$allowed_origins = [
    "http://localhost:5173",
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

// Disable HTML errors to ensure JSON response
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../../config/db.php';

function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

try {
    // 2. INPUT & VALIDATION
    // --------------------------------------------------
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) sendError("Invalid JSON input");

    $required = ['first_name', 'last_name', 'phone', 'email', 'password', 'user_type'];
    foreach ($required as $f) {
        if (empty($input[$f])) sendError("Missing required field: $f");
    }

    $firstName = trim($input['first_name']);
    $middleName = isset($input['middle_name']) ? trim($input['middle_name']) : null;
    $lastName = trim($input['last_name']);
    $email = strtolower(trim($input['email']));
    $phoneRaw = preg_replace('/\D/', '', $input['phone']);
    $phone = substr($phoneRaw, -10);
    $password = $input['password'];
    $userType = $input['user_type'];
    $linkedin = $input['linkedin_url'] ?? null;
    $github = $input['github_url'] ?? null;

    if (strlen($phone) !== 10) sendError("Phone number must be valid 10 digits");

    // 3. CHECK DUPLICATES
    // --------------------------------------------------
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) {
        sendError("User with this Email or Phone already exists.", 409);
    }

    // 4. STEP 1: CREATE USER (The most important part)
    // --------------------------------------------------
    // We do this FIRST so we have a valid User ID for everything else.
    $passHash = password_hash($password, PASSWORD_BCRYPT);

    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmtUser = $conn->prepare($sqlUser);
    if (!$stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github])) {
        throw new Exception("Failed to insert user into database.");
    }

    $userId = $conn->lastInsertId();

    // 5. STEP 2: HANDLE DIRECTORIES & DYNAMIC TABLES
    // --------------------------------------------------

    // Helper: Create Table SQL (Executed instantly)
    function createTable($conn, $tableName, $type) {
        $commonCols = "
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        ";

        if ($type === 'school') {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` ($commonCols, class_grade VARCHAR(50))";
        } else {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` ($commonCols, branch VARCHAR(100), stream VARCHAR(100))";
        }
        $conn->exec($sql);
    }

    // Helper: Handle Directory Logic
    function processDirectory($conn, $name, $type) {
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', trim($name)));

        if ($type === 'school') {
            $dirTable = "directory_schools"; $idCol = "school_id"; $nameCol = "school_name"; $prefix = "school";
        } elseif ($type === 'undergraduate') {
            $dirTable = "directory_colleges_ug"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_ug";
        } else {
            $dirTable = "directory_colleges_pg"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_pg";
        }

        // Check if institution exists
        $stmt = $conn->prepare("SELECT $idCol, dynamic_table_name FROM $dirTable WHERE $nameCol = ?");
        $stmt->execute([trim($name)]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Exists: Just increment count
            $conn->prepare("UPDATE $dirTable SET student_count = student_count + 1 WHERE $idCol = ?")->execute([$row[$idCol]]);
            return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name']];
        } else {
            // New: Insert to directory
            $conn->prepare("INSERT INTO $dirTable ($nameCol, student_count) VALUES (?, 1)")->execute([trim($name)]);
            $newId = $conn->lastInsertId();

            // Create Table Name
            $tableName = "{$prefix}_{$newId}_{$cleanName}";
            if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60);

            // Save Table Name
            $conn->prepare("UPDATE $dirTable SET dynamic_table_name = ? WHERE $idCol = ?")->execute([$tableName, $newId]);

            // Create Physical Table
            createTable($conn, $tableName, $type);

            return ['id' => $newId, 'tableName' => $tableName];
        }
    }

    // 6. STEP 3: INSERT PROFILE DATA (Based on User Type)
    // --------------------------------------------------

    if ($userType === 'school') {
        if (empty($input['school_name']) || empty($input['class_grade'])) throw new Exception("School Name and Class are required");

        $meta = processDirectory($conn, $input['school_name'], 'school');

        // Link Profile
        $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)")
             ->execute([$userId, $meta['id'], $input['class_grade']]);

        // Add to Dynamic Table
        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $input['class_grade']]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name']) || empty($input['branch']) || empty($input['stream'])) throw new Exception("College details are required");

        $meta = processDirectory($conn, $input['college_name'], $userType);
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';

        // Link Profile
        $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $meta['id'], $input['branch'], $input['stream']]);

        // Add to Dynamic Table
        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $input['branch'], $input['stream']]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) throw new Exception("Job Role is required");

        $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)")
             ->execute([$userId, $input['job_role']]);
    }

    // 7. SUCCESS RESPONSE
    // --------------------------------------------------
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'user_id' => $userId
    ]);

} catch (Exception $e) {
    // If user was created but profile failed, we should technically delete the user to keep DB clean.
    // However, for debugging 500 errors, we return the message first.

    $errorMsg = $e->getMessage();
    error_log("Register Error: " . $errorMsg);

    // Return specific SQL error to frontend so you can see it in Console
    sendError("Database Error: " . $errorMsg, 500);
}
?>