<?php
// public/api/events/register.php

// 1. Setup & Headers
ob_start();
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

require_once '../config/db.php';

// 2. Get Input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// 3. Validation - UPDATED: Added 'dob' to required fields
$required = ['event_id', 'first_name', 'last_name', 'email', 'contact_no', 'gender', 'dob', 'city', 'organization', 'role'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit;
    }
}

$identifier = $data['event_id'];

try {
    // 4. Find the Event & Dynamic Table Name
    // UPDATED LOGIC: Support both ID (Numeric) and Slug (String)
    $sql = "SELECT registration_table_name, title, registration_deadline, start_date FROM events WHERE ";
    $params = [];

    if (is_numeric($identifier)) {
        $sql .= "event_id = ?";
        $params[] = $identifier;
    } else {
        $sql .= "slug = ?";
        $params[] = $identifier;
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        throw new Exception("Event not found.");
    }

    $tableName = $event['registration_table_name'];

    // 5. Security Check: Validate Table Name format
    if (!preg_match('/^event_\d+_[a-zA-Z0-9_]+$/', $tableName)) {
        throw new Exception("Invalid registration table configuration.");
    }

    // 6. Check Deadline
    $deadline = !empty($event['registration_deadline']) ? $event['registration_deadline'] : $event['start_date'];
    if (new DateTime() > new DateTime($deadline)) {
        throw new Exception("Registration for this event has closed.");
    }

    // 7. Check for Duplicate Registration (Email)
    $checkStmt = $conn->prepare("SELECT reg_id FROM $tableName WHERE email = ?");
    $checkStmt->execute([$data['email']]);
    if ($checkStmt->rowCount() > 0) {
        throw new Exception("You have already registered for this event with this email.");
    }

    // 8. Insert into Dynamic Table
    $sql = "INSERT INTO $tableName (
        first_name, last_name, email, contact_no, dob, gender,
        city, organization_name, job_title,
        status, registered_at
    ) VALUES (
        :fname, :lname, :email, :phone, :dob, :gender,
        :city, :org, :role,
        'registered', NOW()
    )";

    $insertStmt = $conn->prepare($sql);
    $insertStmt->execute([
        ':fname'  => $data['first_name'],
        ':lname'  => $data['last_name'],
        ':email'  => $data['email'],
        ':phone'  => $data['contact_no'],
        ':dob'    => $data['dob'], // Now required, so no ?? NULL fallback needed
        ':gender' => $data['gender'],
        ':city'   => $data['city'],
        ':org'    => $data['organization'],
        ':role'   => $data['role']
    ]);

    ob_end_clean();
    echo json_encode([
        "status" => "success",
        "message" => "Registration successful!",
        "event_title" => $event['title']
    ]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>