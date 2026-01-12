<?php
// public/api/events/list.php
require_once '../config/db.php';

// Allow CORS for public access
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

try {
    // Fetch ONLY published events, sorted by Latest Start Date first
    $sql = "SELECT
                event_id, title, subtitle, slug, description,
                event_type, start_date, end_date, registration_deadline,
                mode, venue_name, location_city,
                fee_type, price, banner_image_url, tags
            FROM events
            WHERE status = 'published'
            ORDER BY start_date DESC"; // Latest first

    $stmt = $conn->query($sql);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $events]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>