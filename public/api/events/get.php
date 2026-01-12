<?php
// public/api/events/get.php
require_once '../config/db.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID or Slug required"]);
    exit;
}

try {
    // --- UPDATED LOGIC: Support both ID (Numeric) and Slug (String) ---

    // Start building the query
    $sql = "SELECT * FROM events WHERE status = 'published' AND ";
    $params = [];

    // Check if the input is a number (Legacy ID support) or a String (Custom Slug)
    if (is_numeric($id)) {
        $sql .= "event_id = ?";
        $params[] = $id;
    } else {
        // It's a string, so search by slug
        $sql .= "slug = ?";
        $params[] = $id;
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        throw new Exception("Event not found or not published");
    }

    echo json_encode(["status" => "success", "data" => $event]);

} catch (Exception $e) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>