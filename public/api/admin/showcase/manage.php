<?php
// public/api/admin/showcase/manage.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../../../config/db.php';

// 2. INPUT PARSING
$data = json_decode(file_get_contents("php://input"), true);

// Parameters
$action = $data['action'] ?? ''; // 'publish', 'feature', 'delete'
$id = $data['id'] ?? null;       // The ID in the MASTER table
$type = $data['type'] ?? 'showcase'; // 'showcase' or 'lens'

if (!$id || !$action) {
    echo json_encode(['status' => 'error', 'message' => 'Missing ID or Action']);
    exit;
}

try {
    $conn->beginTransaction();

    // =================================================================
    // LOGIC FOR SHOWCASE (VIDEOS)
    // =================================================================
    if ($type === 'showcase') {

        // Fetch Item
        $stmt = $conn->prepare("SELECT * FROM master_showcase WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Video Project not found.");

        // --- ACTION: PUBLISH ---
        if ($action === 'publish') {
            // Check if already in gallery
            $check = $conn->prepare("SELECT id FROM showcase_gallery WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                // Copy ALL new fields to Gallery
                $sql = "INSERT INTO showcase_gallery
                        (master_id, student_name, college_name, project_title, project_description, category, tech_stack, video_url, lens_link)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                $conn->prepare($sql)->execute([
                    $id,
                    $item['student_name'],
                    $item['college_name'],
                    $item['project_title'],
                    $item['project_description'],
                    $item['category'],
                    $item['tech_stack'],
                    $item['video_path'],
                    $item['lens_link']
                ]);
            }
            // Mark Master as Published
            $conn->prepare("UPDATE master_showcase SET status = 'published' WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Project Published to Website']);
        }

        // --- ACTION: FEATURE ---
        elseif ($action === 'feature') {
            $shouldFeature = $data['value'] ? 1 : 0;
            $conn->prepare("UPDATE showcase_gallery SET is_featured = ? WHERE master_id = ?")->execute([$shouldFeature, $id]);
            echo json_encode(['status' => 'success', 'message' => 'Feature status updated']);
        }

        // --- ACTION: DELETE ---
        elseif ($action === 'delete') {
            // 1. Delete Video File
            $filePath = '../../..' . $item['video_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // 2. Delete from DB (Cascade will remove from Gallery too)
            $conn->prepare("DELETE FROM master_showcase WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Project Deleted & File Removed']);
        }
    }

    // =================================================================
    // LOGIC FOR LENSES (LINKS)
    // =================================================================
    else {

        // Fetch Item
        $stmt = $conn->prepare("SELECT * FROM master_lens WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Lens not found.");

        // --- ACTION: PUBLISH ---
        if ($action === 'publish') {
            $check = $conn->prepare("SELECT id FROM lens_gallery WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                $sql = "INSERT INTO lens_gallery (master_id, student_name, lens_link, category) VALUES (?, ?, ?, ?)";
                $conn->prepare($sql)->execute([
                    $id,
                    $item['student_name'],
                    $item['lens_link'],
                    $item['category']
                ]);
            }
            $conn->prepare("UPDATE master_lens SET status = 'published' WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Lens Published to Website']);
        }

        // --- ACTION: FEATURE ---
        elseif ($action === 'feature') {
            $shouldFeature = $data['value'] ? 1 : 0;
            $conn->prepare("UPDATE lens_gallery SET is_featured = ? WHERE master_id = ?")->execute([$shouldFeature, $id]);
            echo json_encode(['status' => 'success', 'message' => 'Feature status updated']);
        }

        // --- ACTION: DELETE ---
        elseif ($action === 'delete') {
            $conn->prepare("DELETE FROM master_lens WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Lens Deleted']);
        }
    }

    $conn->commit();

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>