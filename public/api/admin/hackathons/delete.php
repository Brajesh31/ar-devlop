<?php
// public/api/admin/hackathons/delete.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID is required"]);
    exit;
}

try {
    // 1. Get Slug to find potential "Rogue Legacy Tables"
    $stmt = $conn->prepare("SELECT slug FROM hackathons WHERE id = :id");
    $stmt->execute([':id' => $input['id']]);
    $hackathon = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($hackathon) {
        $slug = $hackathon['slug'];

        // 2. CLEANUP: Drop the specific legacy table if it exists
        // (This fixes your issue where the table wasn't being deleted)
        $tableName = "participants_" . str_replace('-', '_', $slug);

        // Safety check: Never drop the unified table
        if ($tableName !== 'hackathon_participants') {
            $conn->exec("DROP TABLE IF EXISTS `$tableName`");
        }
    }

    // 3. DELETE: Remove from master table
    $deleteStmt = $conn->prepare("DELETE FROM hackathons WHERE id = :id");
    $deleteStmt->execute([':id' => $input['id']]);

    if ($deleteStmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Hackathon and associated legacy data deleted"]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hackathon not found"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>