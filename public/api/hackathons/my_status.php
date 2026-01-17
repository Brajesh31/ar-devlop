<?php
// public/api/hackathons/my_status.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 1. Get Input (User ID & Hackathon ID/Slug)
$userId = $_GET['userId'] ?? null;
$hackathonId = $_GET['hackathonId'] ?? null; // Can be slug or ID

if (!$userId || !$hackathonId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "User ID and Hackathon ID are required"]);
    exit;
}

try {
    // 2. Resolve Hackathon ID (in case slug was passed)
    $hStmt = $conn->prepare("SELECT id FROM hackathons WHERE id = :id OR slug = :slug LIMIT 1");
    $hStmt->execute([':id' => $hackathonId, ':slug' => $hackathonId]);
    $hackathon = $hStmt->fetch(PDO::FETCH_ASSOC);

    if (!$hackathon) {
        echo json_encode(["status" => "error", "message" => "Hackathon not found"]);
        exit;
    }

    $realHackathonId = $hackathon['id'];

    // 3. Check Registration Status
    // We join with the Teams table to get the Code and Name if they exist
    $sql = "SELECT
                hp.status,
                hp.role,
                hp.registered_at,
                t.team_name,
                t.team_code,
                t.members_count
            FROM hackathon_participants hp
            LEFT JOIN hackathon_teams t ON hp.team_id = t.id
            WHERE hp.user_id = :uid AND hp.hackathon_id = :hid
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':uid' => $userId, ':hid' => $realHackathonId]);
    $participant = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($participant) {
        // User IS registered
        echo json_encode([
            "status" => "registered",
            "data" => [
                "registrationStatus" => $participant['status'], // 'approved', 'pending'
                "role" => $participant['role'],                 // 'leader', 'member', 'solo'
                "teamName" => $participant['team_name'],
                "teamCode" => $participant['team_code'],        // The 6-digit code
                "registeredAt" => $participant['registered_at']
            ]
        ]);
    } else {
        // User is NOT registered
        // We also check the Queue to see if a request is pending processing
        $qSql = "SELECT status FROM hackathon_registrations_queue
                 WHERE user_id = :uid AND hackathon_id = :hid AND status = 'pending'";
        $qStmt = $conn->prepare($qSql);
        $qStmt->execute([':uid' => $userId, ':hid' => $realHackathonId]);

        if ($qStmt->fetch()) {
             echo json_encode([
                "status" => "queued",
                "message" => "Registration is processing..."
            ]);
        } else {
            echo json_encode([
                "status" => "not_registered"
            ]);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>