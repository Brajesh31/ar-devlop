<?php
// public/api/admin/showcase/manage.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
// Relative path to api/config/db.php
require_once '../../config/db.php';

// 3. INPUT PARSING
$data = json_decode(file_get_contents("php://input"), true);

$action = $data['action'] ?? ''; // 'approve', 'reject', 'feature', 'unfeature'
$id = $data['id'] ?? 0;
$type = $data['type'] ?? 'showcase'; // 'showcase' or 'lens'

if (!$id || !$action) {
    echo json_encode(['status' => 'error', 'message' => 'Missing ID or Action']);
    exit;
}

try {
    $conn->beginTransaction();

    // ==========================================
    // CASE 1: SHOWCASE (VIDEO)
    // ==========================================
    if ($type === 'showcase') {
        $masterTable = 'master_showcase';
        $galleryTable = 'showcase_gallery';

        // Fetch Master Record to get file path
        $stmt = $conn->prepare("SELECT * FROM $masterTable WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Project not found");

        // --- ACTION: APPROVE (PUBLISH) ---
        if ($action === 'approve') {
            // 1. Mark Master as Published
            $conn->prepare("UPDATE $masterTable SET status = 'published' WHERE id = ?")->execute([$id]);

            // 2. Check if already in Gallery
            $check = $conn->prepare("SELECT id FROM $galleryTable WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                // 3. Copy to Gallery (Public Website)
                $sql = "INSERT INTO $galleryTable
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
                    $item['video_path'], // Maps to video_url
                    $item['lens_link']
                ]);
            }
            echo json_encode(['status' => 'success', 'message' => 'Project Published to Website']);
        }

        // --- ACTION: REJECT (DELETE) ---
        elseif ($action === 'reject') {
            // 1. Delete Video File from Server (Save Space!)
            // Path in DB is like '/uploads/videos/...'
            // We need to go back 3 levels to reach 'public' then find uploads
            $filePath = '../../..' . $item['video_path'];

            if (file_exists($filePath)) {
                unlink($filePath); // Delete file
            }

            // 2. Delete Record (Cascading delete removes from Gallery too)
            $conn->prepare("DELETE FROM $masterTable WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Project Rejected & File Deleted']);
        }

        // --- ACTION: FEATURE ---
        elseif ($action === 'feature') {
             $conn->prepare("UPDATE $galleryTable SET is_featured = 1 WHERE master_id = ?")->execute([$id]);
             echo json_encode(['status' => 'success', 'message' => 'Project marked as Featured']);
        }

        elseif ($action === 'unfeature') {
             $conn->prepare("UPDATE $galleryTable SET is_featured = 0 WHERE master_id = ?")->execute([$id]);
             echo json_encode(['status' => 'success', 'message' => 'Project removed from Featured']);
        }
    }

    // ==========================================
    // CASE 2: LENS (LINKS)
    // ==========================================
    elseif ($type === 'lens') {
        $masterTable = 'master_lens';
        $galleryTable = 'lens_gallery';

        $stmt = $conn->prepare("SELECT * FROM $masterTable WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Lens not found");

        if ($action === 'approve') {
            $conn->prepare("UPDATE $masterTable SET status = 'published' WHERE id = ?")->execute([$id]);

            $check = $conn->prepare("SELECT id FROM $galleryTable WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                $sql = "INSERT INTO $galleryTable
                        (master_id, student_name, lens_link, category)
                        VALUES (?, ?, ?, ?)";
                $conn->prepare($sql)->execute([
                    $id,
                    $item['student_name'],
                    $item['lens_link'],
                    $item['category']
                ]);
            }
            echo json_encode(['status' => 'success', 'message' => 'Lens Published']);
        }

        elseif ($action === 'reject') {
            // No file to delete for Lens
            $conn->prepare("DELETE FROM $masterTable WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Lens Deleted']);
        }

        elseif ($action === 'feature') {
             $conn->prepare("UPDATE $galleryTable SET is_featured = 1 WHERE master_id = ?")->execute([$id]);
             echo json_encode(['status' => 'success', 'message' => 'Lens Featured']);
        }

        elseif ($action === 'unfeature') {
             $conn->prepare("UPDATE $galleryTable SET is_featured = 0 WHERE master_id = ?")->execute([$id]);
             echo json_encode(['status' => 'success', 'message' => 'Lens Un-featured']);
        }
    }

    $conn->commit();

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>