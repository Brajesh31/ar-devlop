<?php
// public/api/admin/events/list.php

// 1. Silence & Log
ob_start();
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/event_error.log');
error_reporting(E_ALL);

require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}

try {
    // 2. Fetch Events
    $sql = "SELECT
                event_id, title, event_type, start_date, end_date,
                status, banner_image_url, registration_table_name, price, fee_type
            FROM events
            ORDER BY start_date DESC";

    $stmt = $conn->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Count Registrations Safely
    foreach ($events as &$event) {
        $count = 0;
        if (!empty($event['registration_table_name'])) {
            $table = $event['registration_table_name'];

            // Only query if table name is safe alphanumeric
            if (preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
                try {
                    // Check if table exists to avoid crash
                    $check = $conn->query("SHOW TABLES LIKE '$table'");
                    if ($check->rowCount() > 0) {
                        $countStmt = $conn->query("SELECT COUNT(*) FROM $table");
                        $count = $countStmt->fetchColumn();
                    }
                } catch (Exception $e) {
                    // Ignore missing table errors for the count
                    error_log("Count Error for event {$event['event_id']}: " . $e->getMessage());
                }
            }
        }
        $event['registration_count'] = $count;
    }

    ob_end_clean();
    echo json_encode(["status" => "success", "data" => $events]);

} catch (Exception $e) {
    error_log("List API Error: " . $e->getMessage());
    ob_end_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>