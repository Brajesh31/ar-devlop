<?php
// public/api/showcase/submit.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
// Relative path to api/config/db.php from api/showcase/
require_once '../config/db.php';

// CONSTANTS
$MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB (Increased for better UX, adjust as needed)
$UPLOAD_DIR = '../../uploads/videos/';
$ALLOWED_MIME_TYPES = ['video/mp4', 'application/mp4', 'video/x-m4v', 'video/quicktime'];

try {
    // 3. VALIDATE TEXT INPUTS
    $name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';     // New Field
    $college = $_POST['college_name'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $title = $_POST['project_title'] ?? '';
    $category = $_POST['category'] ?? '';
    $lensLink = $_POST['lens_link'] ?? '';

    // Defaults for optional fields
    $description = !empty($_POST['project_description']) ? $_POST['project_description'] : 'Snap AR Lens';
    $techStack = !empty($_POST['tech_stack']) ? $_POST['tech_stack'] : 'Lens Studio';

    // Basic Validation
    if (empty($name) || empty($email) || empty($college) || empty($title)) {
        throw new Exception("Missing required fields: Name, Email, College, or Title.");
    }

    // 4. VALIDATE VIDEO FILE
    if (empty($_FILES['video_file'])) {
        throw new Exception("No video file uploaded.");
    }

    $file = $_FILES['video_file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload failed. Error Code: " . $file['error']);
    }

    if ($file['size'] > $MAX_SIZE_BYTES) {
        throw new Exception("File too large. Limit is 50MB.");
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    if (!in_array($mime, $ALLOWED_MIME_TYPES)) {
        throw new Exception("Invalid file format. Only .mp4 videos are allowed.");
    }

    // 5. SAVE FILE
    if (!is_dir($UPLOAD_DIR)) {
        mkdir($UPLOAD_DIR, 0755, true);
    }

    // Generate Safe Filename: timestamp_cleanEmail_random.mp4
    $safeEmail = preg_replace('/[^a-zA-Z0-9]/', '', substr($email, 0, 8));
    $filename = time() . '_' . $safeEmail . '_' . rand(1000, 9999) . '.mp4';
    $destination = $UPLOAD_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception("Failed to move uploaded file to storage.");
    }

    // 6. HIGH-SPEED INSERT
    // We insert into 'inbox_showcase'.
    // The Cron Job will handle user matching and moving to Master later.

    $webPath = '/uploads/videos/' . $filename;
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    $sql = "INSERT INTO inbox_showcase
            (raw_name, raw_email, raw_phone, raw_college, gender,
             project_title, project_description, category, tech_stack,
             video_path, lens_link, submission_ip, is_processed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $name,
        $email,
        $phone,
        $college,
        $gender,
        $title,
        $description,
        $category,
        $techStack,
        $webPath,
        $lensLink,
        $ip
    ]);

    // 7. SUCCESS RESPONSE
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Project received successfully!',
        'video_path' => $webPath
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>