<?php
// public/api/hackathons/get.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 1. Get ID or Slug
$id = $_GET['id'] ?? null;
$slug = $_GET['slug'] ?? null;

if (!$id && !$slug) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hackathon ID or Slug is required"]);
    exit;
}

try {
    // 2. Fetch Full Details
    $sql = "SELECT
        id, slug, title,
        description,
        long_description as longDescription,

        start_date as startDate,
        end_date as endDate,
        registration_deadline as registrationDeadline,

        status, mode, location,
        registration_url as registrationUrl,
        results_url as resultsUrl,

        prize_pool as prizePool,
        fee_type as fee,
        fee_amount as feeAmount,

        team_size_type as teamSize,
        min_team_size as minTeamSize,
        max_team_size as maxTeamSize,

        banner_image as image,

        -- Meta Columns
        meta_tracks, meta_mentors, meta_jury,
        meta_themes, meta_timeline, meta_prizes,
        meta_faqs, meta_partners

    FROM hackathons
    WHERE id = :id OR slug = :slug
    LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':id' => $id,
        ':slug' => $slug ?? $id
    ]);

    $hackathon = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hackathon) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hackathon not found"]);
        exit;
    }

    // 3. Decode JSON Fields
    $jsonMap = [
        'tracks'    => 'meta_tracks',
        'mentors'   => 'meta_mentors',
        'jury'      => 'meta_jury',
        'themes'    => 'meta_themes',
        'timeline'  => 'meta_timeline',
        'prizes'    => 'meta_prizes',
        'faqs'      => 'meta_faqs',
        'partners'  => 'meta_partners'
    ];

    foreach ($jsonMap as $frontendKey => $dbColumn) {
        $hackathon[$frontendKey] = json_decode($hackathon[$dbColumn] ?? '[]', true);
        unset($hackathon[$dbColumn]);
    }

    // 4. Format Computed Fields
    // Team Size Range (e.g., "2-5 members")
    if ($hackathon['teamSize'] === 'solo') {
        $hackathon['teamSizeRange'] = 'Solo';
    } else {
        $hackathon['teamSizeRange'] = $hackathon['minTeamSize'] . '-' . $hackathon['maxTeamSize'] . ' members';
    }

    // Number conversions
    $hackathon['feeAmount'] = (float)$hackathon['feeAmount'];
    $hackathon['minTeamSize'] = (int)$hackathon['minTeamSize'];
    $hackathon['maxTeamSize'] = (int)$hackathon['maxTeamSize'];

    echo json_encode([
        "status" => "success",
        "data" => $hackathon
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>