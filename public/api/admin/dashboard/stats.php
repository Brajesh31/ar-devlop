<?php
// public/api/admin/dashboard/stats.php

require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

try {
    // 1. Get Total Counts
    // We use COUNT(*) which is very fast
    $students_query = $conn->query("SELECT COUNT(*) FROM students WHERE status = 'active'");
    $students_count = $students_query->fetchColumn();

    $events_query = $conn->query("SELECT COUNT(*) FROM events WHERE status != 'draft'");
    $events_count = $events_query->fetchColumn();

    $hackathons_query = $conn->query("SELECT COUNT(*) FROM hackathons WHERE status != 'ended'");
    $hackathons_count = $hackathons_query->fetchColumn();

    // 2. Calculate Growth (Mock Logic for now)
    // In a real scenario, you would compare this month's count vs last month's
    // For now, we simulate a realistic calculation based on total users
    $growth = ($students_count > 0) ? round(($students_count / 100) * 12.5, 1) : 0;

    // 3. Get Recent Activity (Mock Data structure, but ready for real DB integration)
    // Later we will create an 'activity_logs' table to populate this dynamically
    $recent_activity = [
        [
            "user" => "System",
            "action" => "System Ready",
            "target" => "Dashboard",
            "time" => "Just now",
            "type" => "system"
        ]
    ];

    // If we have students, add a fake "New Registration" log for liveliness
    if ($students_count > 0) {
        array_unshift($recent_activity, [
            "user" => "New User",
            "action" => "Joined Platform",
            "target" => "BharatXR",
            "time" => "Recently",
            "type" => "user"
        ]);
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "counts" => [
                "students" => (int)$students_count,
                "events" => (int)$events_count,
                "hackathons" => (int)$hackathons_count,
                "growth" => $growth
            ],
            "activity" => $recent_activity
        ]
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>