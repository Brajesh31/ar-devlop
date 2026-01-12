<?php
// public/api/admin/events/update.php

ob_start();
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/event_error.log');
error_reporting(E_ALL);

require_once '../../config/db.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

// Get Input
$input = file_get_contents("php://input");
$data = json_decode($input);

if (empty($data->event_id) || empty($data->title)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID and Title are required"]);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Fetch Current Event Data
    $stmt = $conn->prepare("SELECT title, slug, registration_table_name FROM events WHERE event_id = ?");
    $stmt->execute([$data->event_id]);
    $currentEvent = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentEvent) {
        throw new Exception("Event not found");
    }

    // 2. Determine New Slug (Custom vs Auto)
    $currentSlug = $currentEvent['slug'];
    $newSlug = $currentSlug; // Default: Keep existing
    $titleChanged = ($currentEvent['title'] !== $data->title);

    if (!empty($data->slug)) {
        // CASE A: User provided a custom slug -> Sanitize & Use it
        $newSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->slug)));
    } elseif ($titleChanged) {
        // CASE B: Title changed & No custom slug -> Auto-generate (Legacy behavior)
        $newSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->title))) . '-' . time();
    }

    $slugChanged = ($newSlug !== $currentSlug);
    $newTableName = $currentEvent['registration_table_name'];

    // 3. Rename Table if Slug Changed
    if ($slugChanged) {
        // Generate safe table name from new slug
        $safe_slug = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace('-', '_', $newSlug));
        $newTableName = "event_{$data->event_id}_{$safe_slug}";

        $oldTable = $currentEvent['registration_table_name'];

        // Only rename if table name is different
        if (!empty($oldTable) && $oldTable !== $newTableName) {
            // Check if old table exists
            $check = $conn->query("SHOW TABLES LIKE '$oldTable'");
            if ($check->rowCount() > 0) {
                // RENAME TABLE
                $conn->exec("RENAME TABLE `$oldTable` TO `$newTableName`");
            } else {
                // Create if missing (Safety fallback)
                $tableSql = "CREATE TABLE IF NOT EXISTS $newTableName (
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
            }
        }
    }

    // 4. Update Event Record
    $sql = "UPDATE events SET
        title = :title,
        subtitle = :subtitle,
        slug = :slug,
        description = :desc,
        long_description = :long_desc,
        event_type = :type,
        start_date = :start,
        end_date = :end,
        registration_deadline = :deadline,
        mode = :mode,
        venue_name = :venue,
        location_city = :city,
        fee_type = :fee_type,
        price = :price,
        team_size = :team_size,
        banner_image_url = :banner,
        registration_table_name = :table_name,
        tags = :tags,
        eligibility = :eligibility,
        rewards = :rewards,
        timeline = :timeline,
        faqs = :faqs
        WHERE event_id = :id";

    $stmt = $conn->prepare($sql);

    function safe_json_encode_update($val) {
        return json_encode($val ?? []) ?: '[]';
    }

    $stmt->execute([
        ':title' => $data->title,
        ':subtitle' => $data->subtitle ?? '',
        ':slug' => $newSlug,
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
        ':table_name' => $newTableName,
        ':tags' => safe_json_encode_update($data->tags ?? []),
        ':eligibility' => safe_json_encode_update($data->eligibility ?? new stdClass()),
        ':rewards' => safe_json_encode_update($data->rewards ?? []),
        ':timeline' => safe_json_encode_update($data->timeline ?? []),
        ':faqs' => safe_json_encode_update($data->faqs ?? []),
        ':id' => $data->event_id
    ]);

    $conn->commit();

    ob_end_clean();
    echo json_encode([
        "status" => "success",
        "message" => "Event updated successfully",
        "slug_changed" => $slugChanged // Debug flag
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    error_log("Update Error: " . $e->getMessage());
    ob_end_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>