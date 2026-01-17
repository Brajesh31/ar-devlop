<?php
// public/api/showcase/submit.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
require_once '../../config/db.php';

// CONSTANTS - Enforcing your 3MB Limit
$MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
$UPLOAD_DIR = '../../uploads/videos/';
$ALLOWED_MIME_TYPES = ['video/mp4', 'application/mp4', 'video/x-m4v'];

try {
    // 3. VALIDATE TEXT INPUTS
    $name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $college = $_POST['college_name'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $title = $_POST['project_title'] ?? '';
    $category = $_POST['category'] ?? '';
    $lensLink = $_POST['lens_link'] ?? '';

    // APPLY DEFAULTS (As requested)
    // If empty, default to 'Snap AR Lens' and 'Lens Studio'
    $description = !empty($_POST['project_description']) ? $_POST['project_description'] : 'Snap AR Lens';
    $techStack = !empty($_POST['tech_stack']) ? $_POST['tech_stack'] : 'Lens Studio';

    // Validate Required Fields
    if (empty($name) || empty($email) || empty($college) || empty($title) || empty($category)) {
        throw new Exception("Missing required fields: Name, Email, College, Title, or Category.");
    }

    // 4. VALIDATE VIDEO FILE
    if (empty($_FILES['video_file'])) {
        throw new Exception("No video file uploaded.");
    }

    $file = $_FILES['video_file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload failed. Error Code: " . $file['error']);
    }

    // STRICT 3MB CHECK
    if ($file['size'] > $MAX_SIZE_BYTES) {
        throw new Exception("File too large. Maximum allowed size is 3MB.");
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

    $safeEmail = preg_replace('/[^a-zA-Z0-9]/', '', substr($email, 0, 8));
    $filename = time() . '_' . $safeEmail . '_' . rand(1000, 9999) . '.mp4';
    $destination = $UPLOAD_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception("Failed to move uploaded file to storage.");
    }

    // 6. FAST INSERT TO INBOX
    // Including all new columns so no data is lost
    $webPath = '/uploads/videos/' . $filename;
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    $sql = "INSERT INTO inbox_showcase
            (raw_name, raw_email, raw_college, gender, project_title, project_description, category, tech_stack, video_path, lens_link, submission_ip, is_processed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $name,
        $email,
        $college,
        $gender,
        $title,
        $description, // Will be 'Snap AR Lens' if user left empty
        $category,
        $techStack,   // Will be 'Lens Studio' if user left empty
        $webPath,
        $lensLink,
        $ip
    ]);

    // 7. SUCCESS
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Project received! It is being processed for the Master List.'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>