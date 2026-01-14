<?php
// public/api/events/register.php

// 1. Start Session & Headers
session_start();
ob_start();

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

require_once '../config/db.php';

// 2. AUTHENTICATION CHECK (The Gatekeeper)
if (!isset($_SESSION['user_id'])) {
    ob_end_clean();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Please log in to register for this event."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (empty($data['event_id'])) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID is missing."]);
    exit;
}

// 3. VALIDATE FORM SPECIFIC FIELDS
// We trust the User ID for name/email, but we still need these inputs from the form
$requiredFormFields = ['gender', 'dob', 'city', 'organization', 'role'];
foreach ($requiredFormFields as $field) {
    if (empty($data[$field])) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit;
    }
}

$identifier = $data['event_id'];

try {
    $conn->beginTransaction();

    // 4. FETCH VERIFIED USER DATA (Identity Protection)
    // We do NOT trust the name/email sent from the form. We pull it from the DB.
    $userStmt = $conn->prepare("SELECT first_name, last_name, email, phone FROM users WHERE user_id = ?");
    $userStmt->execute([$user_id]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("User account not found.");
    }

    // 5. FIND EVENT & TABLE NAME
    $sql = "SELECT event_id, registration_table_name, title, registration_deadline, start_date FROM events WHERE ";
    $params = [];

    if (is_numeric($identifier)) {
        $sql .= "event_id = ?";
        $params[] = $identifier;
    } else {
        $sql .= "slug = ?";
        $params[] = $identifier;
    }

    $evtStmt = $conn->prepare($sql);
    $evtStmt->execute($params);
    $event = $evtStmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        throw new Exception("Event not found.");
    }

    $tableName = $event['registration_table_name'];
    $actualEventId = $event['event_id'];

    // 6. CHECK DEADLINE
    $deadline = !empty($event['registration_deadline']) ? $event['registration_deadline'] : $event['start_date'];
    if (new DateTime() > new DateTime($deadline)) {
        throw new Exception("Registration for this event has closed.");
    }

    // 7. CHECK FOR DUPLICATE REGISTRATION (Using Map Table for speed)
    $checkMap = $conn->prepare("SELECT id FROM user_event_map WHERE user_id = ? AND event_id = ?");
    $checkMap->execute([$user_id, $actualEventId]);
    if ($checkMap->rowCount() > 0) {
        throw new Exception("You are already registered for this event.");
    }

    // 8. WRITE 1: Insert into DYNAMIC ADMIN TABLE
    // We use the VERIFIED user data here + form specific data (like organization/role)
    $sqlDynamic = "INSERT INTO $tableName (
        user_id, first_name, last_name, email, contact_no,
        dob, gender, city, organization_name, job_title,
        status, registered_at
    ) VALUES (
        :uid, :fname, :lname, :email, :phone,
        :dob, :gender, :city, :org, :role,
        'registered', NOW()
    )";

    $insertStmt = $conn->prepare($sqlDynamic);
    $insertStmt->execute([
        ':uid'    => $user_id,
        ':fname'  => $user['first_name'], // Verified from DB
        ':lname'  => $user['last_name'],  // Verified from DB
        ':email'  => $user['email'],      // Verified from DB
        ':phone'  => $user['phone'],      // Verified from DB
        ':dob'    => $data['dob'],        // From Form
        ':gender' => $data['gender'],     // From Form
        ':city'   => $data['city'],       // From Form
        ':org'    => $data['organization'], // From Form
        ':role'   => $data['role']        // From Form
    ]);

    // 9. WRITE 2: Insert into MASTER MAP TABLE (For Student Dashboard)
    // This allows us to instantly show 'My Events' without scanning 100 tables
    $sqlMap = "INSERT IGNORE INTO user_event_map (user_id, event_id, registration_table) VALUES (?, ?, ?)";
    $mapStmt = $conn->prepare($sqlMap);
    $mapStmt->execute([$user_id, $actualEventId, $tableName]);

    $conn->commit();

    ob_end_clean();
    echo json_encode([
        "status" => "success",
        "message" => "Registration successful!",
        "event_title" => $event['title'],
        "redirect" => "/student/events"
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>