<?php
// public/api/auth/register.php

// --- 1. CONFIGURATION & HEADERS ---
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

// Enable error reporting but catch them to return JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../../config/db.php';

// Helper to force JSON error response even on crash
function sendError($msg, $code = 400, $details = null) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'message' => $msg,
        'details' => $details
    ]);
    exit;
}

try {
    // Force PDO to throw exceptions
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 2. INPUT VALIDATION ---
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) sendError("Invalid JSON input received");

    $required = ['first_name', 'last_name', 'phone', 'email', 'password', 'user_type'];
    foreach ($required as $f) {
        if (empty($input[$f])) sendError("Missing required field: $f");
    }

    // Clean Data
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

    // --- 3. CHECK DUPLICATES ---
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) sendError("User with this Email or Phone already exists.", 409);

    // --- 4. STEP 1: CREATE MASTER USER ---
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
        $stmtUser = $conn->prepare($sqlUser);
        $stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github]);
        $userId = $conn->lastInsertId();
    } catch (PDOException $e) {
        throw new Exception("STEP 1 FAILED (User Creation): " . $e->getMessage());
    }

    // --- 5. HELPER FUNCTIONS ---

    function createTableSafe($conn, $tableName, $type) {
        $commonCols = "
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        ";

        if ($type === 'school') {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` ($commonCols, class_grade VARCHAR(50)) ENGINE=InnoDB";
        } else {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` ($commonCols, branch VARCHAR(100), stream VARCHAR(100)) ENGINE=InnoDB";
        }

        try {
            $conn->exec($sql);
        } catch (PDOException $e) {
            // Log but don't stop execution if possible, but for registration we should probably know
            error_log("Table Creation Failed: " . $e->getMessage());
            throw new Exception("Failed to create student list table: " . $e->getMessage());
        }
    }

    function processDirectory($conn, $name, $type) {
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', trim($name)));
        if (empty($cleanName)) $cleanName = "institution";

        if ($type === 'school') {
            $dirTable = "directory_schools"; $idCol = "school_id"; $nameCol = "school_name"; $prefix = "school";
        } elseif ($type === 'undergraduate') {
            $dirTable = "directory_colleges_ug"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_ug";
        } else {
            $dirTable = "directory_colleges_pg"; $idCol = "college_id"; $nameCol = "college_name"; $prefix = "college_pg";
        }

        // Check Directory
        $stmt = $conn->prepare("SELECT $idCol, dynamic_table_name FROM $dirTable WHERE $nameCol = ?");
        $stmt->execute([trim($name)]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Update Count
            $conn->prepare("UPDATE $dirTable SET student_count = student_count + 1 WHERE $idCol = ?")->execute([$row[$idCol]]);

            // ENSURE TABLE EXISTS (Fix for "Table doesn't exist" error)
            if (!empty($row['dynamic_table_name'])) {
                createTableSafe($conn, $row['dynamic_table_name'], $type);
                return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name']];
            }
        }

        // New Entry
        $stmtIns = $conn->prepare("INSERT INTO $dirTable ($nameCol, student_count) VALUES (?, 1)");
        $stmtIns->execute([trim($name)]);
        $newId = $conn->lastInsertId();

        $tableName = "{$prefix}_{$newId}_{$cleanName}";
        if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60);

        $conn->prepare("UPDATE $dirTable SET dynamic_table_name = ? WHERE $idCol = ?")->execute([$tableName, $newId]);

        createTableSafe($conn, $tableName, $type);
        return ['id' => $newId, 'tableName' => $tableName];
    }

    // --- 6. STEP 2 & 3: DIRECTORY & PROFILES ---

    if ($userType === 'school') {
        if (empty($input['school_name'])) throw new Exception("School Name required");
        $classGrade = $input['class_grade'] ?? 'N/A';

        $meta = processDirectory($conn, $input['school_name'], 'school');

        // Link Profile
        $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)")
             ->execute([$userId, $meta['id'], $classGrade]);

        // Add to Dynamic Table
        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $classGrade]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name'])) throw new Exception("College Name required");

        $meta = processDirectory($conn, $input['college_name'], $userType);
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';
        $branch = $input['branch'] ?? 'N/A';
        $stream = $input['stream'] ?? 'N/A';

        // Link Profile
        $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)")
             ->execute([$userId, $meta['id'], $branch, $stream]);

        // Add to Dynamic Table
        $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)")
             ->execute([$userId, $firstName, $lastName, $branch, $stream]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) throw new Exception("Job Role required");

        $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)")
             ->execute([$userId, $input['job_role']]);
    }

    // --- SUCCESS ---
    echo json_encode(['status' => 'success', 'message' => 'Registration successful', 'user_id' => $userId]);

} catch (Exception $e) {
    // If we failed after creating a user, we technically have an "Orphan User".
    // In production, we'd delete them. For now, we just report the error.
    error_log("REGISTER API ERROR: " . $e->getMessage());
    sendError("Registration Failed: " . $e->getMessage(), 500, $e->getTraceAsString());
}
?>