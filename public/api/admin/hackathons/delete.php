<?php
// public/api/admin/hackathons/delete.php

// 1. Setup & Headers
header('Content-Type: application/json');
require_once '../../config/db.php';

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Get Input Data
$input = json_decode(file_get_contents("php://input"), true);

// 3. Validation: ID is required
if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hackathon ID is required"]);
    exit;
}

try {
    // 4. Execute Delete
    // Thanks to ON DELETE CASCADE in the database setup, this SINGLE line
    // automatically deletes all related Teams, Participants, and Queue items.
    $stmt = $conn->prepare("DELETE FROM hackathons WHERE id = :id");
    $stmt->execute([':id' => $input['id']]);

    // 5. Check if anything was actually deleted
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "Hackathon and all related data deleted successfully"
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Hackathon not found"
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
?>