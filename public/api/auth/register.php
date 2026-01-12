<?php
// public/api/auth/register.php

// 1. CORS & Security Headers
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
header('Content-Type: application/json');

// Enable Error Reporting for Debugging (Check your PHP logs)
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../../config/db.php';

function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

// 2. Get Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) sendError("Invalid JSON input");

// 3. Validation
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

// Optional Social Links
$linkedin = $input['linkedin_url'] ?? null;
$github = $input['github_url'] ?? null;

if (strlen($phone) !== 10) sendError("Phone number must be valid 10 digits");

try {
    // 4. Check for Duplicates
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) {
        sendError("User with this Email or Phone already exists.", 409);
    }

    // =================================================================
    // 5. HELPER: DIRECTORY & TABLE CREATION (NO TRANSACTIONS)
    // =================================================================

    function createInstitutionTable($conn, $tableName, $type) {
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

    function getOrCreateIndex($conn, $name, $type) {
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
            $update = $conn->prepare("UPDATE $dirTable SET student_count = student_count + 1 WHERE $idCol = ?");
            $update->execute([$row[$idCol]]);
            return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name']];
        } else {
            $stmtIns = $conn->prepare("INSERT INTO $dirTable ($nameCol, student_count) VALUES (?, 1)");
            $stmtIns->execute([trim($name)]);
            $newId = $conn->lastInsertId();

            $tableName = "{$prefix}_{$newId}_{$cleanName}";
            if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60);

            $stmtUpd = $conn->prepare("UPDATE $dirTable SET dynamic_table_name = ? WHERE $idCol = ?");
            $stmtUpd->execute([$tableName, $newId]);

            createInstitutionTable($conn, $tableName, $type);
            return ['id' => $newId, 'tableName' => $tableName];
        }
    }

    // =================================================================
    // 6. EXECUTE INSERTIONS (SEQUENTIAL)
    // =================================================================

    // A. Create Master User
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtUser = $conn->prepare($sqlUser);
    $stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github]);
    $userId = $conn->lastInsertId();

    // B. Handle Specific Profiles
    if ($userType === 'school') {
        if (empty($input['school_name']) || empty($input['class_grade'])) sendError("School Name and Class are required");

        $meta = getOrCreateIndex($conn, $input['school_name'], 'school');

        $stmtProf = $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['class_grade']]);

        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['class_grade']]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name']) || empty($input['branch']) || empty($input['stream'])) sendError("College details are required");

        $meta = getOrCreateIndex($conn, $input['college_name'], $userType);
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';

        $stmtProf = $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['branch'], $input['stream']]);

        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['branch'], $input['stream']]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) sendError("Job Role is required");

        $stmtProf = $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)");
        $stmtProf->execute([$userId, $input['job_role']]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'user_id' => $userId
    ]);

} catch (Exception $e) {
    error_log("Register Error: " . $e->getMessage());
    sendError("Server Error: " . $e->getMessage(), 500);
}
?>