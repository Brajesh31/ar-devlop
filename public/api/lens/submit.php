<?php
// public/api/lens/submit.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../config/db.php';

// 2. INPUT PARSING
$input = json_decode(file_get_contents('php://input'), true);

$response = ['status' => 'error', 'message' => 'Unknown error'];

try {
    // 3. VALIDATION
    $name = $input['full_name'] ?? '';
    $email = $input['email'] ?? '';
    $college = $input['college_name'] ?? '';
    $lensLink = $input['lens_link'] ?? '';
    $gender = $input['gender'] ?? 'Not Specified';

    if (empty($name) || empty($email) || empty($college) || empty($lensLink)) {
        throw new Exception("Missing required fields.");
    }

    // Basic URL validation
    if (!filter_var($lensLink, FILTER_VALIDATE_URL)) {
        throw new Exception("Invalid Lens URL format.");
    }

    // 4. INSERT TO INBOX
    // We store raw data. The Cron Job will verify the user later.
    $sql = "INSERT INTO inbox_lens
            (raw_name, raw_email, raw_college, gender, lens_link, submission_ip, is_processed)
            VALUES (?, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);

    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    $stmt->execute([
        $name,
        $email,
        $college,
        $gender,
        $lensLink,
        $ip
    ]);

    // 5. SUCCESS
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