<?php
// public/api/lens/submit.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
// Relative path to api/config/db.php from api/lens/
require_once '../config/db.php';

// 3. INPUT PARSING
$input = json_decode(file_get_contents('php://input'), true);

try {
    // 4. VALIDATION
    $name = $input['full_name'] ?? '';
    $email = $input['email'] ?? '';
    $phone = $input['phone'] ?? '';     // New Field
    $college = $input['college_name'] ?? '';
    $lensLink = $input['lens_link'] ?? '';

    // Apply Defaults
    $gender = $input['gender'] ?? 'Not Specified';
    $category = $input['category'] ?? 'Lens';

    // Check Required Fields
    if (empty($name) || empty($email) || empty($phone) || empty($college) || empty($lensLink)) {
        throw new Exception("Missing required fields: Name, Email, Phone, College, or Lens Link.");
    }

    // Basic URL validation
    if (!filter_var($lensLink, FILTER_VALIDATE_URL)) {
        throw new Exception("Invalid Lens URL format.");
    }

    // 5. HIGH-SPEED INSERT
    // Dumping into 'inbox_lens' for the Cron Job to pick up later.

    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    $sql = "INSERT INTO inbox_lens
            (raw_name, raw_email, raw_phone, raw_college, gender,
             lens_link, category, submission_ip, is_processed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        $name,
        $email,
        $phone,
        $college,
        $gender,
        $lensLink,
        $category,
        $ip
    ]);

    // 6. SUCCESS
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Lens submitted successfully! It will be reviewed shortly.'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>