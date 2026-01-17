<?php
// public/api/showcase/get_public.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: application/json');

require_once '../../config/db.php';

try {
    // 2. FETCH FROM GALLERY TABLE
    // We strictly use 'showcase_gallery' (Public Layer), NOT 'master_showcase'.
    // This ensures we only show Approved & Published items.

    $sql = "SELECT
                id,
                student_name,
                college_name,
                project_title,
                project_description,
                category,
                tech_stack,
                video_url,
                lens_link,
                views,
                likes,
                is_featured,
                created_at
            FROM showcase_gallery
            ORDER BY is_featured DESC, created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. SEGREGATE DATA (For your 3-Section Frontend)
    $featured = [];
    $allProjects = [];

    foreach ($rows as $row) {
        // "All" contains everything (for the main grid)
        $allProjects[] = $row;

        // "Featured" contains only marked items (for the top slider)
        if ($row['is_featured'] == 1) {
            $featured[] = $row;
        }
    }

    // 4. RETURN STRUCTURED JSON
    echo json_encode([
        'status' => 'success',
        'data' => [
            'featured' => $featured, // Section 1: Top Featured
            'all'      => $allProjects // Section 2: All Videos
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch showcase.']);
}
?>