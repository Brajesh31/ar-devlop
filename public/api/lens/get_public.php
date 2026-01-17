<?php
// public/api/lens/get_public.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: application/json');

require_once '../../config/db.php';

try {
    // 2. FETCH FROM LENS GALLERY
    $sql = "SELECT
                id,
                student_name,
                lens_link,
                category,
                views,
                likes,
                is_featured,
                created_at
            FROM lens_gallery
            ORDER BY is_featured DESC, created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. SEGREGATE DATA
    $featured = [];
    $allLenses = [];

    foreach ($rows as $row) {
        $allLenses[] = $row;

        if ($row['is_featured'] == 1) {
            $featured[] = $row;
        }
    }

    // 4. RETURN STRUCTURED JSON
    echo json_encode([
        'status' => 'success',
        'data' => [
            'featured' => $featured, // Featured Lenses (if any)
            'all'      => $allLenses // Section 3: All Lenses
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch lenses.']);
}
?>