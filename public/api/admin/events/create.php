<?php
// public/api/admin/events/create.php

// 1. SILENCE OUTPUT (Captures stray warnings)
ob_start();

// 2. Logging Setup
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/event_error.log');
error_reporting(E_ALL);

// 3. Load DB
require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

// 4. Get Input
$input = file_get_contents("php://input");
$data = json_decode($input);

if (empty($data->title) || empty($data->start_date)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Title and Start Date are required"]);
    exit;
}

$eventId = null;
$tableName = null;

try {
    // --- TRANSACTION START ---
    $conn->beginTransaction();

    // 5. Generate or Sanitize Slug (UPDATED LOGIC)
    if (!empty($data->slug)) {
        // Case A: User provided a custom slug -> Sanitize it
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->slug)));
    } else {
        // Case B: No slug provided -> Auto-generate from Title + Timestamp
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->title))) . '-' . time();
    }

    // Safety check: ensure slug isn't empty after sanitization
    if (empty($slug)) {
        $slug = 'event-' . time();
    }

    // 6. Insert Event
    $sql = "INSERT INTO events (
        title, subtitle, slug, description, long_description,
        event_type, start_date, end_date, registration_deadline,
        mode, venue_name, location_city,
        fee_type, price, team_size,
        banner_image_url,
        tags, eligibility, rewards, timeline, faqs,
        status
    ) VALUES (
        :title, :subtitle, :slug, :desc, :long_desc,
        :type, :start, :end, :deadline,
        :mode, :venue, :city,
        :fee_type, :price, :team_size,
        :banner,
        :tags, :eligibility, :rewards, :timeline, :faqs,
        'published'
    )";

    $stmt = $conn->prepare($sql);

    function safe_json_encode($val) {
        return json_encode($val ?? []) ?: '[]';
    }

    $stmt->execute([
        ':title' => $data->title,
        ':subtitle' => $data->subtitle ?? '',
        ':slug' => $slug, // Uses the logic above
        ':desc' => $data->description ?? '',
        ':long_desc' => $data->long_description ?? '',
        ':type' => $data->event_type ?? 'workshop',
        ':start' => $data->start_date,
        ':end' => !empty($data->end_date) ? $data->end_date : null,
        ':deadline' => !empty($data->registration_deadline) ? $data->registration_deadline : null,
        ':mode' => $data->mode ?? 'online',
        ':venue' => $data->venue_name ?? '',
        ':city' => $data->location_city ?? '',
        ':fee_type' => $data->fee_type ?? 'free',
        ':price' => $data->price ?? 0.00,
        ':team_size' => $data->team_size ?? 'Individual',
        ':banner' => $data->banner_image_url ?? '',
        ':tags' => safe_json_encode($data->tags ?? []),
        ':eligibility' => safe_json_encode($data->eligibility ?? new stdClass()),
        ':rewards' => safe_json_encode($data->rewards ?? []),
        ':timeline' => safe_json_encode($data->timeline ?? []),
        ':faqs' => safe_json_encode($data->faqs ?? [])
    ]);

    $eventId = $conn->lastInsertId();

    // --- CRITICAL FIX: COMMIT NOW ---
    $conn->commit();
    // --- TRANSACTION END ---


    // 7. Create Table (Using the safe slug in the name)
    $safe_slug = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace('-', '_', $slug));
    $tableName = "event_{$eventId}_{$safe_slug}";

    $tableSql = "CREATE TABLE IF NOT EXISTS $tableName (
        reg_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        contact_no VARCHAR(20) NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        city VARCHAR(100) NOT NULL,
        organization_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(150) NOT NULL,
        user_id INT NULL,
        status ENUM('registered','attended','cancelled') DEFAULT 'registered',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $conn->exec($tableSql);

    // 8. Link Table
    $updateStmt = $conn->prepare("UPDATE events SET registration_table_name = :tbl WHERE event_id = :id");
    $updateStmt->execute([':tbl' => $tableName, ':id' => $eventId]);

    // 9. CLEAN OUTPUT & SEND SUCCESS
    ob_end_clean();
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "message" => "Event Created Successfully",
        "id" => $eventId
    ]);

} catch (Exception $e) {
    // Handling Rollback manually since commit might have passed
    if ($conn->inTransaction()) {
        $conn->rollBack();
    } elseif ($eventId) {
        // If transaction was committed but Table creation failed, clean up
        try {
            $conn->exec("DELETE FROM events WHERE event_id = $eventId");
            if ($tableName) $conn->exec("DROP TABLE IF EXISTS $tableName");
        } catch (Exception $cleanupError) {
            error_log("Cleanup Failed: " . $cleanupError->getMessage());
        }
    }

    error_log("Create Event Error: " . $e->getMessage());

    ob_end_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
?>