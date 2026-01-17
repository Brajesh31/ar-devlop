<?php
// public/api/admin/showcase/list_master.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIG
require_once '../../config/db.php';

// 3. PARAMETERS
$type = $_GET['type'] ?? 'showcase'; // 'showcase' or 'lens'
$status = $_GET['status'] ?? 'all';  // 'pending', 'published', 'rejected', 'all'
$startDate = $_GET['start_date'] ?? '2024-01-01';
$endDate = $_GET['end_date'] ?? date('Y-m-d');

// Determine Table
$tableName = ($type === 'lens') ? 'master_lens' : 'master_showcase';

try {
    // 4. QUERY BUILDER
    // We select ALL columns. The 'user_id' column tells us if they are verified.
    $sql = "SELECT * FROM $tableName
            WHERE DATE(received_at) BETWEEN ? AND ?";

    $params = [$startDate, $endDate];

    // Apply Status Filter
    if ($status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY received_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $allData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. SEGREGATE DATA (Verified vs Guest)
    $verified = [];
    $guest = [];

    foreach ($allData as $row) {
        // Enforce Type consistency for frontend
        $row['type'] = $type;

        // Logic: If user_id is NOT NULL, they are a Registered Student
        if (!empty($row['user_id'])) {
            $verified[] = $row;
        } else {
            $guest[] = $row;
        }
    }

    // 6. RETURN JSON
    echo json_encode([
        'status' => 'success',
        'meta' => [
            'type' => $type,
            'range' => "$startDate to $endDate",
            'filter_status' => $status,
            'count_total' => count($allData),
            'count_verified' => count($verified),
            'count_guest' => count($guest)
        ],
        'data' => [
            'verified_students' => $verified,
            'guest_submissions' => $guest
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>