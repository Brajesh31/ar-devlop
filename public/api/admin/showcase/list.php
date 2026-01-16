<?php
// public/api/admin/showcase/list.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../../api/config/db.php';

// 2. FILTERS
$startDate = $_GET['start_date'] ?? '2024-01-01';
$endDate = $_GET['end_date'] ?? date('Y-m-d');
$type = $_GET['type'] ?? 'showcase'; // 'showcase' (Video) or 'lens' (Links)
$status = $_GET['status'] ?? 'all'; // 'pending', 'approved', 'rejected', or 'all'

$tableName = ($type === 'lens') ? 'master_lens' : 'master_showcase';

try {
    // 3. QUERY BUILDER
    // We fetch ALL data because this is the ADMIN view
    $baseQuery = "SELECT * FROM $tableName WHERE DATE(submitted_at) BETWEEN ? AND ?";
    $params = [$startDate, $endDate];

    if ($status !== 'all' && $type === 'showcase') {
        $baseQuery .= " AND admin_status = ?";
        $params[] = $status;
    }

    // 4. FETCH VERIFIED (Logged In Users)
    // We specifically look for account_status = 'verified'
    $sqlVerified = $baseQuery . " AND account_status = 'verified' ORDER BY submitted_at DESC";
    $stmtV = $conn->prepare($sqlVerified);
    $stmtV->execute($params);
    $verifiedData = $stmtV->fetchAll(PDO::FETCH_ASSOC);

    // 5. FETCH GUEST (Unregistered Users)
    // We look for account_status = 'guest'
    $sqlGuest = $baseQuery . " AND account_status = 'guest' ORDER BY submitted_at DESC";
    $stmtG = $conn->prepare($sqlGuest);
    $stmtG->execute($params);
    $guestData = $stmtG->fetchAll(PDO::FETCH_ASSOC);

    // 6. RETURN SPLIT RESPONSE
    echo json_encode([
        'status' => 'success',
        'meta' => [
            'type' => $type,
            'range' => "$startDate to $endDate",
            'filter_status' => $status,
            'count_verified' => count($verifiedData),
            'count_guest' => count($guestData)
        ],
        'data' => [
            'verified_students' => $verifiedData,
            'guest_submissions' => $guestData
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>