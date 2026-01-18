<?php
// public/api/admin/hackathons/update.php

header('Content-Type: application/json');
require_once '../../config/db.php';

// CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hackathon ID is required"]);
    exit;
}

try {
    $fieldsToUpdate = [];
    $params = [':id' => $input['id']];

    // MAPPING: Frontend Key => DB Column
    $columnMap = [
        'title' => 'title',
        'description' => 'description',
        'longDescription' => 'long_description',
        'startDate' => 'start_date',
        'endDate' => 'end_date',
        'registrationDeadline' => 'registration_deadline',
        'status' => 'status',
        'mode' => 'mode',
        'location' => 'location',
        'image' => 'banner_image',
        'prizePool' => 'prize_pool',
        'fee' => 'fee_type',
        'feeAmount' => 'fee_amount',
        'teamSize' => 'team_size_type',
        'minTeamSize' => 'min_team_size',
        'maxTeamSize' => 'max_team_size',
        'registrationUrl' => 'registration_url',
        'resultsUrl' => 'results_url'
    ];

    foreach ($columnMap as $key => $col) {
        if (array_key_exists($key, $input)) {
            $fieldsToUpdate[] = "$col = :$key";
            $params[":$key"] = $input[$key];
        }
    }

    // JSON Arrays
    $jsonMap = [
        'tracks' => 'meta_tracks',
        'mentors' => 'meta_mentors',
        'jury' => 'meta_jury',
        'timeline' => 'meta_timeline',
        'prizes' => 'meta_prizes',
        'faqs' => 'meta_faqs',
        'partners' => 'meta_partners'
    ];

    foreach ($jsonMap as $key => $col) {
        if (array_key_exists($key, $input)) {
            $fieldsToUpdate[] = "$col = :$key";
            $params[":$key"] = json_encode($input[$key]);
        }
    }

    if (empty($fieldsToUpdate)) {
        echo json_encode(["status" => "success", "message" => "No changes detected"]);
        exit;
    }

    $sql = "UPDATE hackathons SET " . implode(", ", $fieldsToUpdate) . " WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["status" => "success", "message" => "Hackathon details updated successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>