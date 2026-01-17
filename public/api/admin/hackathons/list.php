<?php
// public/api/hackathons/list.php

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
    // 1. Fetch Summary Data
    // We map DB columns (snake_case) to Frontend props (camelCase) directly in SQL
    $sql = "SELECT
        id,
        slug,
        title,
        description,
        start_date as startDate,
        end_date as endDate,
        registration_deadline as registrationDeadline,
        status,
        mode,
        location,
        prize_pool as prizePool,
        team_size_type as teamSize,
        min_team_size,
        max_team_size,
        fee_type as fee,
        fee_amount as feeAmount,
        banner_image as image,

        -- We need these for filtering/displaying tags on the card
        meta_tracks,
        meta_themes
    FROM hackathons
    ORDER BY start_date DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $raw_hackathons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Process & Decode
    $hackathons = array_map(function($h) {

        // Decode JSON fields
        $h['tracks'] = json_decode($h['meta_tracks'] ?? '[]', true);
        $h['themes'] = json_decode($h['meta_themes'] ?? '[]', true);

        // Remove raw meta columns
        unset($h['meta_tracks']);
        unset($h['meta_themes']);

        // Add calculated field for Team Range (e.g., "2-5 members")
        if ($h['teamSize'] === 'solo') {
            $h['teamSizeRange'] = 'Solo';
        } else {
            $h['teamSizeRange'] = $h['min_team_size'] . '-' . $h['max_team_size'] . ' members';
        }

        // Ensure numbers are numeric types
        $h['feeAmount'] = (float)$h['feeAmount'];

        return $h;
    }, $raw_hackathons);

    echo json_encode([
        "status" => "success",
        "data" => $hackathons
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>