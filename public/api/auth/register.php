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

// Helper for Error Responses
function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

// 2. Get & Validate Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) sendError("Invalid JSON input");

$required = ['first_name', 'last_name', 'phone', 'email', 'password', 'user_type'];
foreach ($required as $f) {
    if (empty($input[$f])) sendError("Missing required field: $f");
}

// Sanitize Inputs
$firstName = trim($input['first_name']);
$middleName = isset($input['middle_name']) ? trim($input['middle_name']) : null;
$lastName = trim($input['last_name']);
$email = strtolower(trim($input['email']));
$phoneRaw = preg_replace('/\D/', '', $input['phone']);
$phone = substr($phoneRaw, -10);
$password = $input['password'];
$userType = $input['user_type'];
$linkedin = $input['linkedin'] ?? null;
$github = $input['github'] ?? null;

if (strlen($phone) !== 10) sendError("Phone number must be valid 10 digits");

try {
    // 3. Security Check: Prevent Duplicates
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR phone = ?");
    $stmt->execute([$email, $phone]);
    if ($stmt->rowCount() > 0) {
        sendError("User with this Email or Phone already exists.", 409);
    }

    // =================================================================
    // 4. DYNAMIC TABLE LOGIC (The Core Feature)
    // =================================================================

    /**
     * Creates a new table for a School or College with ALL profile columns.
     * RELATIONS: user_id maps to 'users' table.
     */
    function createInstitutionTable($conn, $tableName, $type) {
        $commonColumns = "
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),

            -- Extended Profile Data (Ready for 'Complete Profile' step)
            profile_pic_url VARCHAR(255) NULL,
            about_me TEXT NULL,
            skills TEXT NULL, -- Stored as JSON or Comma-separated
            education_details TEXT NULL, -- Extra JSON data for detailed education history
            achievements TEXT NULL,

            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            -- RELATION LINE: Connects this student to the Master User Table
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        ";

        $sql = "";
        if ($type === 'school') {
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` (
                $commonColumns,
                class_grade VARCHAR(50) -- Specific to Schools
            )";
        } else {
            // Undergraduate or Graduate
            $sql = "CREATE TABLE IF NOT EXISTS `$tableName` (
                $commonColumns,
                branch VARCHAR(100), -- Specific to Colleges
                stream VARCHAR(100)  -- Specific to Colleges
            )";
        }
        $conn->exec($sql);
    }

    /**
     * Manages Directory Entries & Counts
     */
    function getOrCreateIndex($conn, $name, $type) {
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', trim($name)));
        $timestamp = time();

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

        // Check if Institution Exists in Directory
        $stmt = $conn->prepare("SELECT $idCol, dynamic_table_name FROM $dirTable WHERE $colName = ?");
        $stmt->execute([trim($name)]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // EXISTING: Just increment the student count
            $updateStmt = $conn->prepare("UPDATE $dirTable SET student_count = student_count + 1 WHERE $idCol = ?");
            $updateStmt->execute([$row[$idCol]]);

            return ['id' => $row[$idCol], 'tableName' => $row['dynamic_table_name']];
        } else {
            // NEW: Create Entry & New Table
            $tableName = "{$prefix}_{$timestamp}_{$cleanName}";
            if (strlen($tableName) > 60) $tableName = substr($tableName, 0, 60);

            // 1. Insert into Directory
            $stmtIns = $conn->prepare("INSERT INTO $dirTable ($colName, dynamic_table_name, student_count) VALUES (?, ?, 1)");
            $stmtIns->execute([trim($name), $tableName]);
            $newId = $conn->lastInsertId();

            // 2. Create the Physical Table
            createInstitutionTable($conn, $tableName, $type);

            return ['id' => $newId, 'tableName' => $tableName];
        }
    }

    // =================================================================
    // 5. EXECUTE REGISTRATION
    // =================================================================
    $conn->beginTransaction();

    // A. Create Master User
    $passHash = password_hash($password, PASSWORD_BCRYPT);
    $sqlUser = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password_hash, user_type, linkedin_url, github_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtUser = $conn->prepare($sqlUser);
    $stmtUser->execute([$firstName, $middleName, $lastName, $email, $phone, $passHash, $userType, $linkedin, $github]);
    $userId = $conn->lastInsertId();

    // B. Route Logic based on User Type
    if ($userType === 'school') {
        if (empty($input['school_name']) || empty($input['class_grade'])) throw new Exception("School Name and Class are required");

        $meta = getOrCreateIndex($conn, $input['school_name'], 'school');

        // 1. Link User -> Directory (Profile Table)
        $stmtProf = $conn->prepare("INSERT INTO profiles_school (user_id, school_id, class_grade) VALUES (?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['class_grade']]);

        // 2. Insert into Specific School Table (Dynamic)
        // Note: Profile fields (about, skills) are left NULL for now, to be filled in 'Complete Profile'
        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, class_grade) VALUES (?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['class_grade']]);

    } elseif ($userType === 'undergraduate' || $userType === 'graduate') {
        if (empty($input['college_name']) || empty($input['branch']) || empty($input['stream'])) throw new Exception("College details are required");

        $meta = getOrCreateIndex($conn, $input['college_name'], $userType);
        $tableProfile = ($userType === 'undergraduate') ? 'profiles_undergrad' : 'profiles_graduate';

        // 1. Link User -> Directory (Profile Table)
        $stmtProf = $conn->prepare("INSERT INTO $tableProfile (user_id, college_id, branch, stream) VALUES (?, ?, ?, ?)");
        $stmtProf->execute([$userId, $meta['id'], $input['branch'], $input['stream']]);

        // 2. Insert into Specific College Table (Dynamic)
        $stmtDyn = $conn->prepare("INSERT INTO `{$meta['tableName']}` (user_id, first_name, last_name, branch, stream) VALUES (?, ?, ?, ?, ?)");
        $stmtDyn->execute([$userId, $firstName, $lastName, $input['branch'], $input['stream']]);

    } elseif ($userType === 'professional') {
        if (empty($input['job_role'])) throw new Exception("Job Role is required");

        // Professionals share one table, no dynamic creation needed
        $stmtProf = $conn->prepare("INSERT INTO profiles_professional (user_id, job_role) VALUES (?, ?)");
        $stmtProf->execute([$userId, $input['job_role']]);
    }

    if ($conn->inTransaction()) $conn->commit();

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