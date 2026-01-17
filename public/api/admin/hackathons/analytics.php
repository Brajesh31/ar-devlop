<?php
// public/api/admin/hackathons/analytics.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

try {
    // 1. Total Stats
    $stats = [
        'total_events' => 0,
        'total_participants' => 0,
        'live_events' => 0,
        'upcoming_events' => 0,
        'total_teams' => 0
    ];

    // Count Hackathons by Status
    $sql = "SELECT
                COUNT(*) as count,
                SUM(CASE WHEN status = 'live' THEN 1 ELSE 0 END) as live,
                SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming
            FROM hackathons";
    $stmt = $conn->query($sql);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['total_events'] = (int)$row['count'];
    $stats['live_events'] = (int)$row['live'];
    $stats['upcoming_events'] = (int)$row['upcoming'];

    // Count Total Participants (Across all tables)
    // Note: Since we have separate tables per hackathon (in your original plan) or one unified table (in the final plan),
    // I will assume the UNIFIED table 'hackathon_participants' as agreed.
    $pStmt = $conn->query("SELECT COUNT(*) FROM hackathon_participants");
    $stats['total_participants'] = (int)$pStmt->fetchColumn();

    // Count Total Teams
    $tStmt = $conn->query("SELECT COUNT(*) FROM hackathon_teams");
    $stats['total_teams'] = (int)$tStmt->fetchColumn();

    // 2. Growth Graph (Registrations by Day - Last 7 Days)
    $graphSql = "SELECT
                    DATE(registered_at) as date,
                    COUNT(*) as count
                 FROM hackathon_participants
                 WHERE registered_at >= DATE(NOW()) - INTERVAL 7 DAY
                 GROUP BY DATE(registered_at)
                 ORDER BY date ASC";
    $gStmt = $conn->query($graphSql);
    $growth = $gStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $stats,
        "graph" => $growth
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>