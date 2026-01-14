<?php
// public/api/events/get.php
require_once '../config/db.php';

// 1. Start Session to access User ID
session_start();

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
    // 2. Fetch Event Details
    $sql = "SELECT * FROM events WHERE status = 'published' AND ";
    $params = [];

    // Support both Numeric ID and String Slug
    if (is_numeric($id)) {
        $sql .= "event_id = ?";
        $params[] = $id;
    } else {
        $sql .= "slug = ?";
        $params[] = $id;
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        throw new Exception("Event not found or not published");
    }

    // 3. Check Registration Status (if user is logged in)
    $event['is_registered'] = false;

    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        // Fast lookup in the Map Table
        $regStmt = $conn->prepare("SELECT id FROM user_event_map WHERE user_id = ? AND event_id = ?");
        $regStmt->execute([$userId, $event['event_id']]);

        if ($regStmt->rowCount() > 0) {
            $event['is_registered'] = true;
        }
    }

    // 4. Process JSON Fields (Decode them for Frontend)
    // Based on your setup_events_v2.php schema
    $jsonFields = ['tags', 'rewards', 'timeline', 'faqs', 'eligibility'];

    foreach ($jsonFields as $field) {
        if (!empty($event[$field])) {
            $event[$field] = json_decode($event[$field]);
        } else {
            // Return empty array instead of null/string for safer frontend usage
            $event[$field] = [];
        }
    }

    echo json_encode(["status" => "success", "data" => $event]);

} catch (Exception $e) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>