<?php
// public/api/admin/hackathons/update.php

// 1. Setup & Headers
header('Content-Type: application/json');
require_once '../../config/db.php';

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Get Input Data
$input = json_decode(file_get_contents("php://input"), true);

// 3. Validation: ID is strictly required to find the record
if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hackathon ID is required"]);
    exit;
}

try {
    // 4. Build Dynamic Update Query
    $fieldsToUpdate = [];
    $params = [':id' => $input['id']];

    // --- MAPPING: Frontend Key => Backend Column ---
    $columnMap = [
        'slug'                  => 'slug',
        'title'                 => 'title',
        'description'           => 'description',
        'longDescription'       => 'long_description',
        'startDate'             => 'start_date',
        'endDate'               => 'end_date',
        'registrationDeadline'  => 'registration_deadline',
        'status'                => 'status',
        'mode'                  => 'mode',
        'location'              => 'location',
        'registrationUrl'       => 'registration_url',
        'resultsUrl'            => 'results_url',
        'prizePool'             => 'prize_pool',
        'fee'                   => 'fee_type',
        'feeAmount'             => 'fee_amount',
        'teamSize'              => 'team_size_type',
        'minTeamSize'           => 'min_team_size',
        'maxTeamSize'           => 'max_team_size',
        'image'                 => 'banner_image'
    ];

    foreach ($columnMap as $frontendKey => $dbColumn) {
        if (array_key_exists($frontendKey, $input)) {
            $fieldsToUpdate[] = "$dbColumn = :$frontendKey";
            $params[":$frontendKey"] = $input[$frontendKey];
        }
    }

    // --- MAPPING: JSON Arrays ---
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
        if (array_key_exists($frontendKey, $input)) {
            $fieldsToUpdate[] = "$dbColumn = :$frontendKey";
            $params[":$frontendKey"] = json_encode($input[$frontendKey]);
        }
    }

    // 5. Check if there is anything to update
    if (empty($fieldsToUpdate)) {
        echo json_encode(["status" => "success", "message" => "No changes detected"]);
        exit;
    }

    // 6. Execute Query
    $sql = "UPDATE hackathons SET " . implode(", ", $fieldsToUpdate) . " WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["status" => "success", "message" => "Hackathon updated successfully"]);

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "The provided Slug is already taken."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    }
}
?>