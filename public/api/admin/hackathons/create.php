<?php
// public/api/admin/events/create.php

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

// 1. Validation
if (empty($input['title']) || empty($input['startDate'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Title and Start Date are required"]);
    exit;
}

try {
    $conn->beginTransaction();

    // 2. ID & Slug Generation
    $id = $input['id'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title'])));
    $slug = !empty($input['slug']) ? $input['slug'] : $id;

    // 3. Insert into Master Config Table
    $sql = "INSERT INTO hackathons (
        id, slug, title, description, long_description,
        start_date, end_date, registration_deadline,
        status, mode, location,
        registration_url, results_url,
        prize_pool, fee_type, fee_amount,
        team_size_type, min_team_size, max_team_size,
        banner_image,
        meta_tracks, meta_mentors, meta_jury,
        meta_themes, meta_timeline, meta_prizes,
        meta_faqs, meta_partners
    ) VALUES (
        :id, :slug, :title, :description, :longDescription,
        :startDate, :endDate, :regDeadline,
        :status, :mode, :location,
        :regUrl, :resUrl,
        :prizePool, :fee, :feeAmount,
        :teamSize, :minTeam, :maxTeam,
        :image,
        :tracks, :mentors, :jury,
        :themes, :timeline, :prizes,
        :faqs, :partners
    )";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':id' => $id,
        ':slug' => $slug,
        ':title' => $input['title'],
        ':description' => $input['description'] ?? '',
        ':longDescription' => $input['longDescription'] ?? '',
        ':startDate' => $input['startDate'],
        ':endDate' => $input['endDate'],
        ':regDeadline' => $input['registrationDeadline'],
        ':status' => $input['status'] ?? 'upcoming',
        ':mode' => $input['mode'] ?? 'online',
        ':location' => $input['location'] ?? 'Online',
        ':regUrl' => $input['registrationUrl'] ?? null,
        ':resUrl' => $input['resultsUrl'] ?? null,
        ':prizePool' => $input['prizePool'] ?? '',
        ':fee' => $input['fee'] ?? 'free',
        ':feeAmount' => $input['feeAmount'] ?? 0.00,
        ':teamSize' => $input['teamSize'] ?? 'solo',
        ':minTeam' => $input['minTeamSize'] ?? 1,
        ':maxTeam' => $input['maxTeamSize'] ?? 4,
        ':image' => $input['image'] ?? '',
        ':tracks'   => json_encode($input['tracks'] ?? []),
        ':mentors'  => json_encode($input['mentors'] ?? []),
        ':jury'     => json_encode($input['jury'] ?? []),
        ':themes'   => json_encode($input['themes'] ?? []),
        ':timeline' => json_encode($input['timeline'] ?? []),
        ':prizes'   => json_encode($input['prizes'] ?? []),
        ':faqs'     => json_encode($input['faqs'] ?? []),
        ':partners' => json_encode($input['partners'] ?? [])
    ]);

    // 4. DYNAMIC TABLE CREATION
    // We create a specific table for THIS hackathon's participants
    // Table Name format: participants_SLUG (e.g. participants_waves_xr_2025)

    // Sanitize slug for table name (replace hyphens with underscores)
    $safeSlug = str_replace('-', '_', $slug);
    $tableName = "participants_" . $safeSlug;

    $createTableSql = "CREATE TABLE IF NOT EXISTS `$tableName` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,

        -- Team Logic (Stored directly here as requested)
        team_name VARCHAR(100) NULL,
        team_code VARCHAR(10) NULL, -- The 6-digit code
        role ENUM('leader', 'member', 'solo') DEFAULT 'solo',

        -- Status
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Ensure one registration per user
        UNIQUE KEY unique_user (user_id),

        -- Index for faster team lookups
        INDEX idx_team_code (team_code)
    ) ENGINE=InnoDB;";

    $conn->exec($createTableSql);

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Hackathon Created & Registration Table Ready",
        "id" => $id,
        "slug" => $slug,
        "table_created" => $tableName
    ]);

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "ID or Slug already exists."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>