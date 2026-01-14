<?php
// public/api/events/list.php

require_once '../config/db.php';

// 1. Start Session to identify the user
session_start();

// 2. CORS & Headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}
header('Content-Type: application/json');

try {
    // 3. Check for Logged-In User & Fetch Their Registrations
    // We use the new 'user_event_map' for high-speed lookup
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    $registeredEventIds = [];

    if ($userId) {
        $regStmt = $conn->prepare("SELECT event_id FROM user_event_map WHERE user_id = ?");
        $regStmt->execute([$userId]);
        $registeredEventIds = $regStmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // 4. Fetch All Published Events
    $sql = "SELECT
                event_id, title, subtitle, slug, description,
                event_type, start_date, end_date, registration_deadline,
                mode, venue_name, location_city,
                fee_type, price, banner_image_url, tags
            FROM events
            WHERE status = 'published'
            ORDER BY start_date DESC";

    $stmt = $conn->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Process Data (Add 'is_registered' flag & Decode JSON)
    foreach ($events as &$event) {
        // Mark as registered if the ID exists in the user's map
        $event['is_registered'] = in_array($event['event_id'], $registeredEventIds);

        // Decode JSON columns so Frontend receives an Array, not a String
        if (!empty($event['tags'])) {
            $event['tags'] = json_decode($event['tags']);
        } else {
            $event['tags'] = [];
        }
    }

    echo json_encode(["status" => "success", "data" => $events]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>