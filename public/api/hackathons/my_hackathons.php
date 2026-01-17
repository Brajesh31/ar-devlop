<?php
// public/api/users/my_hackathons.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 1. Get User ID
$userId = $_GET['userId'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "User ID is required"]);
    exit;
}

try {
    // 2. Fetch User's Hackathons
    // We join 'hackathon_participants' with 'hackathons' and 'hackathon_teams'
    $sql = "SELECT
        -- Event Details
        h.id,
        h.slug,
        h.title,
        h.start_date as startDate,
        h.end_date as endDate,
        h.status as eventStatus,
        h.banner_image as image,
        h.location,
        h.mode,

        -- Participation Details
        hp.role,
        hp.status as myStatus,
        hp.registered_at as registeredAt,

        -- Team Details (if any)
        t.team_name as teamName,
        t.team_code as teamCode

    FROM hackathon_participants hp
    JOIN hackathons h ON hp.hackathon_id = h.id
    LEFT JOIN hackathon_teams t ON hp.team_id = t.id
    WHERE hp.user_id = :uid
    ORDER BY h.start_date DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':uid' => $userId]);
    $myHackathons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "count" => count($myHackathons),
        "data" => $myHackathons
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>