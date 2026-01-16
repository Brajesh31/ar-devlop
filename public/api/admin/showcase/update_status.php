<?php
// public/api/admin/showcase/update_status.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../config/db.php';

// 2. INPUT PARSING
$input = json_decode(file_get_contents('php://input'), true);

try {
    // 3. VALIDATION
    if (empty($input['submission_id']) || empty($input['type'])) {
        throw new Exception("Missing submission ID or Type.");
    }

    $id = (int) $input['submission_id'];
    $type = $input['type']; // 'lens' or 'showcase'
    $tableName = ($type === 'lens') ? 'master_lens' : 'master_showcase';

    // Allowed columns to update
    // We construct the query dynamically based on what is sent
    $updates = [];
    $params = [];

    // A. Handle Status Update (if sent)
    if (isset($input['status'])) {
        $allowedStatus = ['pending', 'approved', 'rejected'];
        if (!in_array($input['status'], $allowedStatus)) {
            throw new Exception("Invalid status value.");
        }
        $updates[] = "admin_status = ?";
        $params[] = $input['status'];
    }

    // B. Handle Feature Toggle (Showcase only)
    if ($type === 'showcase' && isset($input['is_featured'])) {
        $updates[] = "is_featured = ?";
        $params[] = (int) $input['is_featured']; // 1 or 0
    }

    // C. Execute Update
    if (!empty($updates)) {
        $sql = "UPDATE $tableName SET " . implode(', ', $updates) . " WHERE submission_id = ?";
        $params[] = $id;

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            // It might mean the ID didn't exist OR the value was already the same.
            // We check if ID exists to be sure.
            $check = $conn->query("SELECT submission_id FROM $tableName WHERE submission_id = $id");
            if ($check->rowCount() === 0) {
                throw new Exception("Submission ID not found.");
            }
        }
    }

    // 4. SUCCESS
    echo json_encode([
        'status' => 'success',
        'message' => 'Submission updated successfully.'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>