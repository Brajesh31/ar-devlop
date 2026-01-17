<?php
// public/api/admin/hackathons/participants.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 1. Get Hackathon ID/Slug (Required)
$input_id = $_GET['id'] ?? null;

if (!$input_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hackathon ID or Slug is required"]);
    exit;
}

try {
    // 2. SMART RESOLUTION: Check if input is ID or Slug
    // We strictly resolve the input to the actual database 'id' first.
    $checkStmt = $conn->prepare("SELECT id FROM hackathons WHERE id = :val OR slug = :val LIMIT 1");
    $checkStmt->execute([':val' => $input_id]);
    $hackathon = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$hackathon) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hackathon not found"]);
        exit;
    }

    $realId = $hackathon['id'];

    // 3. Build the Query using the Resolved ID
    $sql = "SELECT
        hp.id as registration_id,
        hp.status as registration_status,
        hp.role,
        hp.registered_at,

        -- User Details (From Users Table)
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,

        -- Team Details (From Teams Table)
        t.team_name,
        t.team_code

    FROM hackathon_participants hp
    JOIN users u ON hp.user_id = u.user_id
    LEFT JOIN hackathon_teams t ON hp.team_id = t.id
    WHERE hp.hackathon_id = :id";

    // Optional: Filter by Status
    if (isset($_GET['status'])) {
        $sql .= " AND hp.status = :status";
    }

    // Optional: Search by Name/Email
    if (isset($_GET['search'])) {
        $sql .= " AND (u.email LIKE :search OR u.first_name LIKE :search)";
    }

    $sql .= " ORDER BY hp.registered_at DESC";

    $stmt = $conn->prepare($sql);

    // Bind Parameters using $realId
    $params = [':id' => $realId];
    if (isset($_GET['status'])) $params[':status'] = $_GET['status'];
    if (isset($_GET['search'])) $params[':search'] = "%" . $_GET['search'] . "%";

    $stmt->execute($params);
    $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "hackathon_id" => $realId, // Useful for debugging
        "count" => count($participants),
        "data" => $participants
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>