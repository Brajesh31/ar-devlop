<?php
// public/api/admin/media/upload.php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Or your frontend domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file uploaded"]);
    exit;
}

try {
    $file = $_FILES['file'];

    // 1. Check Upload Type (Defaults to 'events' if not specified)
    $type = $_POST['type'] ?? 'events';

    // 2. Set Directory & Prefix based on Type
    if ($type === 'hackathon') {
        $folderName = 'hackathons';
        $prefix = 'hack_';
    } else {
        $folderName = 'events';
        $prefix = 'evt_';
    }

    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/' . $folderName . '/';

    // Safety Checks
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        throw new Exception("Only JPG, PNG, WEBP allowed");
    }

    // Generate Clean Filename
    $filename = $prefix . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Construct Public URL
        $protocol = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
        $url = $protocol . $_SERVER['HTTP_HOST'] . '/uploads/' . $folderName . '/' . $filename;

        echo json_encode([
            "status" => "success",
            "url" => $url,
            "path" => $targetPath // Optional: for deletion logic later
        ]);
    } else {
        throw new Exception("Failed to move uploaded file");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>