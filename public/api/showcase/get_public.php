<?php
// public/api/showcase/get_public.php

// 1. HEADERS (Public Access)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: application/json');

require_once '../../config/db.php';

try {
    // 2. QUERY FOR PUBLIC DISPLAY
    // STRICT RULE: Only Approved Projects
    // STRICT RULE: No Sensitive Data (Email/Phone)

    $sql = "SELECT
                project_title,
                video_url,
                lens_link,
                full_name as student_name,
                college_name,
                submitted_at,
                is_featured
            FROM master_showcase
            WHERE admin_status = 'approved'
            ORDER BY is_featured DESC, submitted_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. RETURN CLEAN DATA
    echo json_encode([
        'status' => 'success',
        'count' => count($projects),
        'projects' => $projects
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch showcase.']);
}
?>