<?php
// public/api/student/my_events.php

require_once '../config/db.php';
session_start();

// 1. CORS & Headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

// 2. Auth Check
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // 3. The High-Speed Query
    // We fetch from 'user_event_map' (FAST) and join 'events' (DETAILS)
    // We selects columns needed for the "My Events" card display
    $sql = "SELECT
                e.event_id,
                e.title,
                e.slug,
                e.start_date,
                e.end_date,
                e.banner_image_url,
                e.mode,
                e.location_city,
                e.status as event_status,
                map.registered_at,
                map.registration_table
            FROM user_event_map map
            JOIN events e ON map.event_id = e.event_id
            WHERE map.user_id = ?
            ORDER BY map.registered_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$userId]);
    $myEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "count" => count($myEvents),
        "data" => $myEvents
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>