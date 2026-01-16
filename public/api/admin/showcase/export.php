<?php
// public/api/admin/showcase/export.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: text/csv; charset=utf-8');

// 2. CONFIG
require_once '../../config/db.php';

// 3. PARAMETERS
$type = $_GET['type'] ?? 'lens'; // 'lens' or 'showcase'
$startDate = $_GET['start_date'] ?? '2024-01-01';
$endDate = $_GET['end_date'] ?? date('Y-m-d');

// Set Filename
$filename = "{$type}_export_{$startDate}_to_{$endDate}.csv";
header("Content-Disposition: attachment; filename=\"$filename\"");

// 4. OPEN OUTPUT STREAM
$output = fopen('php://output', 'w');

try {
    // 5. DEFINE COLUMNS BASED ON TYPE
    if ($type === 'lens') {
        // HEADERS
        fputcsv($output, [
            'ID', 'Status', 'Full Name', 'Email', 'College', 'Gender', 'Lens Link', 'Submitted At'
        ]);

        // QUERY (Combined Verified + Guest)
        $sql = "SELECT
                    submission_id, account_status, full_name, email, college_name, gender, lens_link, submitted_at
                FROM master_lens
                WHERE DATE(submitted_at) BETWEEN ? AND ?
                ORDER BY submitted_at DESC";

    } else {
        // SHOWCASE HEADERS
        fputcsv($output, [
            'ID', 'Acc Status', 'Admin Status', 'Featured?', 'Full Name', 'Email', 'College', 'Project Title', 'Video URL', 'Submitted At'
        ]);

        // QUERY
        $sql = "SELECT
                    submission_id, account_status, admin_status, is_featured, full_name, email, college_name, project_title, video_url, submitted_at
                FROM master_showcase
                WHERE DATE(submitted_at) BETWEEN ? AND ?
                ORDER BY submitted_at DESC";
    }

    // 6. EXECUTE & STREAM
    $stmt = $conn->prepare($sql);
    $stmt->execute([$startDate, $endDate]);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Clean up data for CSV (prevent Excel injection or formatting issues)
        // e.g. Prepend ' to phone numbers if they existed
        fputcsv($output, $row);
    }

} catch (Exception $e) {
    // If error, write it to the CSV file itself so admin sees it
    fputcsv($output, ['ERROR', $e->getMessage()]);
}

fclose($output);
exit();
?>