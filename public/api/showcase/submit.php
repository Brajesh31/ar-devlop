<?php
// public/api/showcase/submit.php

// 1. CORS & HEADERS
// Allow requests from your frontend domains
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
// Adjust path to point to your db.php
require_once '../config/db.php';

// CONSTANTS
$MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
$UPLOAD_DIR = '../../uploads/videos/'; // Stores in public/uploads/videos/
$ALLOWED_MIME_TYPES = ['video/mp4', 'application/mp4', 'video/x-m4v'];

$response = ['status' => 'error', 'message' => 'Unknown error'];

try {
    // 3. VALIDATE TEXT INPUTS
    // We use $_POST because we are sending FormData (Multipart)
    $name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $college = $_POST['college_name'] ?? '';
    $title = $_POST['project_title'] ?? '';
    $lensLink = $_POST['lens_link'] ?? ''; // Optional

    if (empty($name) || empty($email) || empty($college) || empty($title)) {
        throw new Exception("Missing required fields: Name, Email, College, or Title.");
    }

    // 4. VALIDATE VIDEO FILE
    if (empty($_FILES['video_file'])) {
        throw new Exception("No video file uploaded.");
    }

    $file = $_FILES['video_file'];

    // Check for Upload Errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload failed. Error Code: " . $file['error']);
    }

    // Check Size
    if ($file['size'] > $MAX_SIZE_BYTES) {
        throw new Exception("File too large. Maximum allowed size is 3MB.");
    }

    // Check MIME Type (Secure Check)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    if (!in_array($mime, $ALLOWED_MIME_TYPES)) {
        throw new Exception("Invalid file format. Only .mp4 videos are allowed. Detected: $mime");
    }

    // 5. SAVE FILE TO HOSTINGER FILESYSTEM
    // Ensure directory exists
    if (!is_dir($UPLOAD_DIR)) {
        if (!mkdir($UPLOAD_DIR, 0755, true)) {
            throw new Exception("Failed to create upload directory.");
        }
    }

    // Generate Safe Filename: timestamp_safeEmail_random.mp4
    // We sanitize the email to remove special chars for the filename
    $safeEmail = preg_replace('/[^a-zA-Z0-9]/', '', substr($email, 0, 8));
    $filename = time() . '_' . $safeEmail . '_' . rand(1000, 9999) . '.mp4';
    $destination = $UPLOAD_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception("Failed to move uploaded file to storage.");
    }

    // 6. FAST INSERT TO INBOX (No User/College Checks)
    $sql = "INSERT INTO inbox_showcase
            (raw_name, raw_email, raw_college, project_title, video_path, lens_link, submission_ip, is_processed)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);

    // We store the 'Web Path' (/uploads/...) not the system path (../../)
    $webPath = '/uploads/videos/' . $filename;
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    $stmt->execute([
        $name,
        $email,
        $college,
        $title,
        $webPath,
        $lensLink,
        $ip
    ]);

    // 7. SUCCESS RESPONSE
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Project uploaded successfully! Our architects will review it shortly.',
        'video_url' => $webPath
    ]);

} catch (Exception $e) {
    // Log error for admin review
    error_log("Showcase Upload Error: " . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>