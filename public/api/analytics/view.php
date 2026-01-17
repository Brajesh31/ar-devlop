<?php
// public/api/analytics/view.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
$type = $input['type'] ?? 'showcase'; // 'showcase' or 'lens'

if (!$id) exit;

try {
    // Increment View Count
    $table = ($type === 'lens') ? 'lens_gallery' : 'showcase_gallery';

    // Using simple update to be extremely fast
    $sql = "UPDATE $table SET views = views + 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id]);

    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    // Fail silently to not break frontend user experience
    exit;
}
?>