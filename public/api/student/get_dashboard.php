<?php
// public/api/student/get_dashboard.php

// 1. START SESSION & HEADERS
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../config/db.php';

// 2. AUTHENTICATION GATEKEEPER
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Please login.']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // =========================================================
    // SECTION A: STUDENT PROFILE
    // =========================================================
    $stmtUser = $conn->prepare("SELECT first_name, last_name, email, phone, college_name FROM users WHERE user_id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("User account not found.");
    }

    // =========================================================
    // SECTION B: MY SHOWCASE (VIDEOS)
    // =========================================================
    // We LEFT JOIN with the Gallery table to get Views/Likes/Featured status if published
    $sqlShowcase = "SELECT
                        m.id,
                        m.project_title,
                        m.project_description,
                        m.category,
                        m.status as admin_status,
                        m.video_path,
                        m.received_at,
                        g.views,
                        g.likes,
                        g.is_featured
                    FROM master_showcase m
                    LEFT JOIN showcase_gallery g ON m.id = g.master_id
                    WHERE m.user_id = ?
                    ORDER BY m.received_at DESC";

    $stmtShowcase = $conn->prepare($sqlShowcase);
    $stmtShowcase->execute([$userId]);
    $myVideos = $stmtShowcase->fetchAll(PDO::FETCH_ASSOC);

    // =========================================================
    // SECTION C: MY LENSES (LINKS)
    // =========================================================
    $sqlLens = "SELECT
                    m.id,
                    m.lens_link,
                    m.category,
                    m.status as admin_status,
                    m.received_at,
                    g.views,
                    g.likes,
                    g.is_featured
                FROM master_lens m
                LEFT JOIN lens_gallery g ON m.id = g.master_id
                WHERE m.user_id = ?
                ORDER BY m.received_at DESC";

    $stmtLens = $conn->prepare($sqlLens);
    $stmtLens->execute([$userId]);
    $myLenses = $stmtLens->fetchAll(PDO::FETCH_ASSOC);

    // =========================================================
    // SECTION D: CALCULATE STATS (Showcase Only)
    // =========================================================
    $totalViews = 0;
    $totalLikes = 0;
    $activeProjects = 0;

    // Sum up views/likes from approved projects
    foreach ($myVideos as $v) {
        if ($v['admin_status'] === 'published') {
            $totalViews += $v['views'] ?? 0;
            $totalLikes += $v['likes'] ?? 0;
            $activeProjects++;
        }
    }
    foreach ($myLenses as $l) {
        if ($l['admin_status'] === 'published') {
            $totalViews += $l['views'] ?? 0;
            $totalLikes += $l['likes'] ?? 0;
            $activeProjects++;
        }
    }

    // =========================================================
    // FINAL RESPONSE
    // =========================================================
    echo json_encode([
        'status' => 'success',
        'data' => [
            'profile' => [
                'name' => $user['first_name'] . ' ' . $user['last_name'],
                'college' => $user['college_name'] ?? 'College Not Set',
                'email' => $user['email']
            ],
            'stats' => [
                'total_submissions' => count($myVideos) + count($myLenses),
                'active_projects' => $activeProjects,
                'total_views' => $totalViews,
                'total_likes' => $totalLikes
            ],
            'submissions' => [
                'videos' => $myVideos,
                'lenses' => $myLenses
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>