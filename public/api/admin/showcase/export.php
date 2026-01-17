<?php
// public/api/admin/showcase/export.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: text/csv; charset=utf-8');

// 2. CONFIG
require_once '../../config/db.php';

// 3. PARAMETERS
$type = $_GET['type'] ?? 'showcase';
$startDate = $_GET['start_date'] ?? '2024-01-01';
$endDate = $_GET['end_date'] ?? date('Y-m-d');

// Set Filename
$filename = "{$type}_export_{$startDate}_to_{$endDate}.csv";
header("Content-Disposition: attachment; filename=\"$filename\"");

// 4. OPEN OUTPUT STREAM
$output = fopen('php://output', 'w');

try {
    // 5. DEFINE HEADERS & QUERY
    if ($type === 'showcase') {
        // Headers for Video Projects
        fputcsv($output, [
            'ID', 'Status', 'Is Verified?', 'Student Name', 'Email', 'Phone',
            'College', 'Gender', 'Project Title', 'Category',
            'Tech Stack', 'Video Path', 'Lens Link', 'Date'
        ]);

        $sql = "SELECT
                    id, status, user_id, student_name, email, phone,
                    college_name, gender, project_title, category,
                    tech_stack, video_path, lens_link, received_at
                FROM master_showcase
                WHERE DATE(received_at) BETWEEN ? AND ?
                ORDER BY received_at DESC";
    } else {
        // Headers for Lenses
        fputcsv($output, [
            'ID', 'Status', 'Is Verified?', 'Student Name', 'Email', 'Phone',
            'College', 'Gender', 'Lens Link', 'Category', 'Date'
        ]);

        $sql = "SELECT
                    id, status, user_id, student_name, email, phone,
                    college_name, gender, lens_link, category, received_at
                FROM master_lens
                WHERE DATE(received_at) BETWEEN ? AND ?
                ORDER BY received_at DESC";
    }

    // 6. EXECUTE & WRITE
    $stmt = $conn->prepare($sql);
    $stmt->execute([$startDate, $endDate]);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Logic: Convert user_id to "Yes/No" string for CSV
        $isVerified = !empty($row['user_id']) ? 'Verified' : 'Guest';

        // Remove user_id from the array to match CSV headers order (it was 3rd in query)
        // We construct the row manually to be safe
        $csvRow = [];
        $csvRow[] = $row['id'];
        $csvRow[] = $row['status'];
        $csvRow[] = $isVerified; // Calculated column
        $csvRow[] = $row['student_name'];
        $csvRow[] = $row['email'];
        $csvRow[] = $row['phone'];
        $csvRow[] = $row['college_name'];
        $csvRow[] = $row['gender'];

        if ($type === 'showcase') {
            $csvRow[] = $row['project_title'];
            $csvRow[] = $row['category'];
            $csvRow[] = $row['tech_stack'];
            $csvRow[] = $row['video_path'];
            $csvRow[] = $row['lens_link'];
        } else {
            $csvRow[] = $row['lens_link'];
            $csvRow[] = $row['category'];
        }

        $csvRow[] = $row['received_at'];

        fputcsv($output, $csvRow);
    }

} catch (Exception $e) {
    fputcsv($output, ['ERROR', $e->getMessage()]);
}

fclose($output);
exit();
?>