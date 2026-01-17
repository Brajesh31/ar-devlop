<?php
// public/api/admin/dashboard/stats.php

require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

try {
    // 1. Get Core Counts (Fast)
    // We use COUNT(*) which is very fast
    $students_query = $conn->query("SELECT COUNT(*) FROM students WHERE status = 'active'");
    $students_count = $students_query->fetchColumn();

    $events_query = $conn->query("SELECT COUNT(*) FROM events WHERE status != 'draft'");
    $events_count = $events_query->fetchColumn();

    $hackathons_query = $conn->query("SELECT COUNT(*) FROM hackathons WHERE status != 'ended'");
    $hackathons_count = $hackathons_query->fetchColumn();

    // 2. Get PENDING ACTION Counts (New!)
    // These numbers tell the Admin "You have work to do!"

    // Pending Videos (Showcase)
    $pendingVideos = $conn->query("SELECT COUNT(*) FROM master_showcase WHERE status = 'pending'")->fetchColumn();

    // Pending Lenses (Lens)
    $pendingLenses = $conn->query("SELECT COUNT(*) FROM master_lens WHERE status = 'pending'")->fetchColumn();


    // 3. Calculate Growth (Mock Logic for now)
    // In a real scenario, you would compare this month's count vs last month's
    $growth = ($students_count > 0) ? round(($students_count / 100) * 12.5, 1) : 0;

    // 4. Activity Feed (Dynamic)
    // We generate alerts if there are items waiting for review
    $recent_activity = [];

    if ($pendingVideos > 0) {
        $recent_activity[] = [
            "user" => "System",
            "action" => "Review Needed",
            "target" => "$pendingVideos New Videos",
            "time" => "Action Required",
            "type" => "warning"
        ];
    }

    if ($pendingLenses > 0) {
        $recent_activity[] = [
            "user" => "System",
            "action" => "Review Needed",
            "target" => "$pendingLenses New Lenses",
            "time" => "Action Required",
            "type" => "warning"
        ];
    }

    // Default message if everything is clear
    if (empty($recent_activity)) {
        $recent_activity[] = [
            "user" => "System",
            "action" => "All Clear",
            "target" => "Dashboard",
            "time" => "Just now",
            "type" => "success"
        ];
    }

    // 5. Return JSON
    echo json_encode([
        "status" => "success",
        "data" => [
            "counts" => [
                "students" => (int)$students_count,
                "events" => (int)$events_count,
                "hackathons" => (int)$hackathons_count,
                "growth" => $growth,
                // New Counters
                "pending_showcase" => (int)$pendingVideos,
                "pending_lens" => (int)$pendingLenses
            ],
            "activity" => $recent_activity
        ]
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>