<?php
// public/api/hackathons/register.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 1. Get Input
$input = json_decode(file_get_contents("php://input"), true);

// 2. Validate Basic Inputs
if (empty($input['userId']) || empty($input['hackathonId']) || empty($input['type'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$userId = $input['userId'];
$hackathonId = $input['hackathonId']; // Can be ID or Slug
$type = $input['type']; // 'solo', 'create_team', 'join_team'

try {
    // 3. Resolve Hackathon Slug to ID (if needed)
    // We need the exact UUID/ID for the database
    $stmt = $conn->prepare("SELECT id, status, allow_team_creation FROM hackathons WHERE id = :id OR slug = :slug LIMIT 1");
    $stmt->execute([':id' => $hackathonId, ':slug' => $hackathonId]);
    $hackathon = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hackathon) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hackathon not found"]);
        exit;
    }

    if ($hackathon['status'] !== 'live' && $hackathon['status'] !== 'upcoming') {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Registration is closed for this event"]);
        exit;
    }

    $realHackathonId = $hackathon['id'];

    // 4. FAST CHECK: Is User Already Registered?
    // We check the final participants table to prevent spamming the queue
    $checkStmt = $conn->prepare("SELECT id FROM hackathon_participants WHERE user_id = :uid AND hackathon_id = :hid");
    $checkStmt->execute([':uid' => $userId, ':hid' => $realHackathonId]);

    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "You are already registered for this hackathon"]);
        exit;
    }

    // 5. Build Queue Payload
    // We bundle all the request details into a JSON object
    $payload = [
        'type' => $type,
        'team_name' => $input['teamName'] ?? null,
        'team_code' => $input['teamCode'] ?? null,
        'timestamp' => time()
    ];

    // 6. Insert into High-Speed Queue
    $sql = "INSERT INTO hackathon_registrations_queue (user_id, hackathon_id, payload_json, status)
            VALUES (:uid, :hid, :payload, 'pending')";

    $queueStmt = $conn->prepare($sql);
    $queueStmt->execute([
        ':uid' => $userId,
        ':hid' => $realHackathonId,
        ':payload' => json_encode($payload)
    ]);

    // 7. Success Response
    // We tell the frontend "Request Received" (Processing happens in background)
    echo json_encode([
        "status" => "success",
        "message" => "Registration queued successfully. You will receive a confirmation shortly.",
        "queue_id" => $conn->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
}
?>