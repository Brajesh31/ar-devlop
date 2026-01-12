<?php
// public/api/admin/events/get_details.php

ob_start();
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/event_error.log');
require_once '../../config/db.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

$id = $_GET['id'] ?? null;

if (!$id) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID required"]);
    exit;
}

try {
    // 1. Get Event Data
    $stmt = $conn->prepare("SELECT * FROM events WHERE event_id = ?");
    $stmt->execute([$id]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        throw new Exception("Event not found with ID: $id");
    }

    // 2. Get Registrations
    $students = [];
    if (!empty($event['registration_table_name'])) {
        $table = $event['registration_table_name'];

        if (preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
            $check = $conn->query("SHOW TABLES LIKE '$table'");
            if ($check->rowCount() > 0) {
                $studentStmt = $conn->query("SELECT * FROM $table ORDER BY registered_at DESC");
                $students = $studentStmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }
    }

    ob_end_clean();
    echo json_encode([
        "status" => "success",
        "event" => $event,
        "registrations" => $students
    ]);

} catch (Exception $e) {
    error_log("Get Details Error: " . $e->getMessage());
    ob_end_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>