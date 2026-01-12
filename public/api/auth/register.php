<?php
// public/api/auth/register.php

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

require_once '../../config/db.php';

// Helper to send JSON errors
function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

// 2. Get & Validate Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) sendError("Invalid JSON input");

// Common required fields
$required = ['first_name', 'last_name', 'phone', 'email', 'password', 'user_type'];
foreach ($required as $f) {
    if (empty($input[$f])) sendError("Missing required field: $f");
}

$firstName = trim($input['first_name']);
$middleName = isset($input['middle_name']) ? trim($input['middle_name']) : null;
$lastName = trim($input['last_name']);
$email = strtolower(trim($input['email']));
$phoneRaw = preg_replace('/\D/', '', $input['phone']); // Remove non-digits (like +91)
$phone = substr($phoneRaw, -10); // Keep last 10 digits
$password = $input['password'];
$userType = $input['user_type']; // 'school', 'undergraduate', 'graduate', 'professional'
$linkedin = $input['linkedin'] ?? null;
$github = $input['github'] ?? null;

if (strlen($phone) !== 10) sendError("Phone number must be valid 10 digits");

try {
    // 3. Security: Check Duplicates
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) {
        sendError("User with this Email or Phone already exists.", 409);
    }

    // 4. Helper Functions for Dynamic Tables

    // Function A: Create the physical table for a new institution
    function createInstitutionTable($conn, $tableName, $type) {
        $sql = "";
        if ($type === 'school') {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                class_grade VARCHAR(50),
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )";
        } else {
            // Undergrad or Graduate
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                branch VARCHAR(100),
                stream VARCHAR(100),
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )";
        }
        $conn->exec($sql); // Implicit commit here
    }

    // Function B: Find existing Institution OR Create new one + Table
    function getOrCreateIndex($conn, $name, $type) {
        // Safe name for DB table (e.g., "IIT Bombay" -> "iit_bombay")
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', trim($name)));
        $timestamp = time();

        // Define directory mapping
        $dirTable = "";
        $prefix = "";
        $colName = ($type === 'school') ? "school_name" : "college_name";
        $idCol = ($type === 'school') ? "school_id" : "college_id";

        if ($type === 'school') {
            $dirTable = "directory_schools";
            $prefix = "school";
        } elseif ($type === 'undergraduate') {
            $dirTable = "directory_colleges_ug";
            $prefix = "college_ug";
        } elseif ($type === 'graduate') {
            $dirTable = "directory_colleges_pg";
            $prefix = "college_pg";
        }

        // Check if exists
        $stmt = $conn->prepare("SELECT $idCol, dynamic_table_name FROM $dirTable WHERE $colName = ?");
        $stmt->execute([trim($name)]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name']];
        } else {
            // New Entry -> Create Table
            $tableName = "{$prefix}_{$timestamp}_{$cleanName}";
            if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60); // Safety limit

            // 1. Add to Directory
            $stmtIns = $conn->prepare("INSERT INTO $dirTable ($colName, dynamic_table_name) VALUES (?, ?)");
            $stmtIns->execute([trim($name), $tableName]);
            $newId = $conn->lastInsertId();

            // 2. Create the Dynamic Table
            createInstitutionTable($conn, $tableName, $type);

            return ['id' => $newId, 'tableName' => $tableName];
        }
    }

    // 5. Begin Transaction (Note: Will be interrupted if createInstitutionTable runs DDL, but that's okay logic-wise)
    $conn->beginTransaction();

    // A. Create User
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtUser = $conn->prepare($sqlUser);
    $stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github]);
    $userId = $conn->lastInsertId();

    // B. Handle Profiles & Dynamic Tables
    if ($userType === 'school') {
        if (empty($input['school_name']) || empty($input['class_grade'])) throw new Exception("School Name and Class are required");

        // Logic: Check Directory -> Get ID & Table Name -> Create Table if new
        $meta = getOrCreateIndex($conn, $input['school_name'], 'school');

        // 1. Add to Profile
        $stmtProf = $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['class_grade']]);

        // 2. Add to Dynamic School Table
        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['class_grade']]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name']) || empty($input['branch']) || empty($input['stream'])) throw new Exception("College details are required");

        $meta = getOrCreateIndex($conn, $input['college_name'], $userType);
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';

        // 1. Add to Profile
        $stmtProf = $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['branch'], $input['stream']]);

        // 2. Add to Dynamic College Table
        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['branch'], $input['stream']]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) throw new Exception("Job Role is required");

        // Simple insertion (No dynamic table as per request)
        $stmtProf = $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)");
        $stmtProf->execute([$userId, $input['job_role']]);
    }

    // Attempt to commit (if transaction is still active)
    if ($conn->inTransaction()) {
        $conn->commit();
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'user_id' => $userId
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    error_log("Registration Error: " . $e->getMessage());
    sendError("Registration failed: " . $e->getMessage(), 500);
}
?>