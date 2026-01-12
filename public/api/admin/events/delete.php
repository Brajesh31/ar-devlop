<?php
// public/api/admin/events/delete.php

ob_start();
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/event_error.log');
require_once '../../config/db.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

// Get JSON Input
$data = json_decode(file_get_contents("php://input"));

if (empty($data->event_id)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID required"]);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Get Event Info (Image & Table Name)
    $stmt = $conn->prepare("SELECT banner_path, registration_table_name FROM events WHERE event_id = ?");
    $stmt->execute([$data->event_id]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($event) {
        // 2. Delete Database Record
        $delStmt = $conn->prepare("DELETE FROM events WHERE event_id = ?");
        $delStmt->execute([$data->event_id]);

        // 3. Delete Image File
        if (!empty($event['banner_path']) && file_exists($event['banner_path'])) {
            unlink($event['banner_path']);
        }
    }

    // 4. COMMIT NOW (Before DDL)
    // Dropping a table causes an implicit commit. If we don't commit here manually,
    // the transaction is lost and PHP might throw an error later.
    $conn->commit();

    // 5. Drop Dynamic Table (DDL Operation - Runs outside transaction)
    if ($event && !empty($event['registration_table_name'])) {
        $tbl = $event['registration_table_name'];
        if (preg_match('/^[a-zA-Z0-9_]+$/', $tbl) && strpos($tbl, 'event_') === 0) {
            $conn->exec("DROP TABLE IF EXISTS $tbl");
        }
    }

    ob_end_clean();
    echo json_encode(["status" => "success", "message" => "Event deleted successfully"]);

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    error_log("Delete Error: " . $e->getMessage());

    ob_end_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>