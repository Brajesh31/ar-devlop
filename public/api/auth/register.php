<?php
// public/api/auth/register.php

// 1. CONFIGURATION & HEADERS
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

ini_set('display_errors', 0);
error_reporting(E_ALL);

// --- FIX: CORRECT PATH TO DB (Up 1 level, not 2) ---
if (file_exists(__DIR__ . '/../config/db.php')) {
    require_once __DIR__ . '/../config/db.php';
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database configuration file missing. Checked: ' . __DIR__ . '/../config/db.php']);
    exit;
}

// Helper to return JSON error
function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

try {
    // 2. INPUT & VALIDATION
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
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) {
        sendError("User with this Email or Phone already exists.", 409);
    }

    // =================================================================
    // 4. PHASE 1: PREPARE DIRECTORY & TABLES (DDL)
    // =================================================================

    function ensureTableExists($conn, $tableName, $type) {
        $commonCols = "
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            profile_pic_url VARCHAR(255) NULL,
            about_me TEXT NULL,
            skills TEXT NULL,
            education_details TEXT NULL,
            achievements TEXT NULL,
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

    function prepareInstitution($conn, $name, $type) {
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', trim($name)));

        if ($type === 'school') {
            $dirTable = "directory_schools"; $idCol = "school_id"; $nameCol = "school_name"; $prefix = "school";
        } elseif ($type === 'undergraduate') {
            $dirTable = "directory_colleges_ug"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_ug";
        } else {
            $dirTable = "directory_colleges_pg"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_pg";
        }

        $stmt = $conn->prepare("SELECT $idCol, dynamic_table_name FROM $dirTable WHERE $nameCol = ?");
        $stmt->execute([trim($name)]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            ensureTableExists($conn, $row['dynamic_table_name'], $type);
            return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name'], 'isNew' => false];
        } else {
            $stmtIns = $conn->prepare("INSERT INTO $dirTable ($nameCol, student_count) VALUES (?, 0)");
            $stmtIns->execute([trim($name)]);
            $newId = $conn->lastInsertId();

            $tableName = "{$prefix}_{$newId}_{$cleanName}";
            if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60);

            $conn->prepare("UPDATE $dirTable SET dynamic_table_name = ? WHERE $idCol = ?")->execute([$tableName, $newId]);
            ensureTableExists($conn, $tableName, $type);

            return ['id' => $newId, 'tableName' => $tableName, 'isNew' => true];
        }
    }

    // -- RUN PREPARATION LOGIC --
    $meta = null;
    if ($userType === 'school') {
        if (empty($input['school_name'])) sendError("School Name required");
        $meta = prepareInstitution($conn, $input['school_name'], 'school');
    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name'])) sendError("College Name required");
        $meta = prepareInstitution($conn, $input['college_name'], $userType);
    }

    // =================================================================
    // 5. PHASE 2: INSERT USER & DATA
    // =================================================================

    // A. Create User
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmtUser = $conn->prepare($sqlUser);
    if (!$stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github])) {
        throw new Exception("Failed to insert user.");
    }
    $userId = $conn->lastInsertId();

    // B. Handle Profiles & Dynamic Inserts
    if ($userType === 'school') {
        $classGrade = $input['class_grade'] ?? '';

        if (!$meta['isNew']) {
            $conn->prepare("UPDATE directory_schools SET student_count = student_count + 1 WHERE school_id = ?")->execute([$meta['id']]);
        } else {
            $conn->prepare("UPDATE directory_schools SET student_count = 1 WHERE school_id = ?")->execute([$meta['id']]);
        }

        $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)")
             ->execute([$userId, $meta['id'], $classGrade]);

        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $classGrade]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';
        $dirTable = ($userType === 'undergraduate') ? 'directory_colleges_ug' : 'directory_colleges_pg';
        $idCol = ($userType === 'undergraduate') ? 'college_id' : 'college_id';

        $branch = $input['branch'] ?? '';
        $stream = $input['stream'] ?? '';

        if (!$meta['isNew']) {
            $conn->prepare("UPDATE $dirTable SET student_count = student_count + 1 WHERE $idCol = ?")->execute([$meta['id']]);
        } else {
            $conn->prepare("UPDATE $dirTable SET student_count = 1 WHERE $idCol = ?")->execute([$meta['id']]);
        }

        $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $meta['id'], $branch, $stream]);

        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $branch, $stream]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) throw new Exception("Job Role required");

        $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)")
             ->execute([$userId, $input['job_role']]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'user_id' => $userId
    ]);

} catch (Exception $e) {
    error_log("REGISTER ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => "Registration Failed: " . $e->getMessage()]);
}
?>