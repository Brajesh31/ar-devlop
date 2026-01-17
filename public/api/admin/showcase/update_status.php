<?php
// public/api/admin/showcase/update_status.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// 2. CONFIGURATION
require_once '../../../config/db.php'; //

// 3. INPUT PARSING
$input = json_decode(file_get_contents('php://input'), true);

$id = $input['submission_id'] ?? null;
$type = $input['type'] ?? 'showcase'; // 'showcase' or 'lens'
$newStatus = $input['status'] ?? '';  // 'approved' (published), 'rejected', 'pending'

if (!$id || !$newStatus) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing ID or Status']);
    exit;
}

try {
    $conn->beginTransaction();

    // ==========================================
    // LOGIC FOR SHOWCASE (VIDEO PROJECTS)
    // ==========================================
    if ($type === 'showcase') {
        $masterTable = 'master_showcase';
        $galleryTable = 'showcase_gallery';

        // 1. Fetch Item Details (Needed for File Path & Data Transfer)
        $stmt = $conn->prepare("SELECT * FROM $masterTable WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Project not found.");

        // --- SCENARIO A: REJECTED (DELETE EVERYTHING) ---
        if ($newStatus === 'rejected') {
            // 1. Delete Video File (Save Storage)
            // Path is stored like '/uploads/videos/file.mp4'
            // We go back 3 levels to root: public/api/admin/showcase/ -> public/
            $filePath = '../../..' . $item['video_path'];

            if (!empty($item['video_path']) && file_exists($filePath)) {
                unlink($filePath); // Physically delete the file
            }

            // 2. Delete from Database (Cascade removes from Gallery too)
            $conn->prepare("DELETE FROM $masterTable WHERE id = ?")->execute([$id]);

            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Project Rejected & Video Deleted.']);
            exit;
        }

        // --- SCENARIO B: APPROVED (PUBLISH TO GALLERY) ---
        elseif ($newStatus === 'approved' || $newStatus === 'published') {
            // 1. Update Master Status
            $conn->prepare("UPDATE $masterTable SET status = 'published' WHERE id = ?")->execute([$id]);

            // 2. Add to Gallery (if not exists)
            $check = $conn->prepare("SELECT id FROM $galleryTable WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
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
                    $item['video_path'],
                    $item['lens_link']
                ]);
            }

            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Project Approved & Published to Website.']);
            exit;
        }

        // --- SCENARIO C: PENDING (UN-PUBLISH) ---
        else {
            // Just update status, do NOT delete file
            $conn->prepare("UPDATE $masterTable SET status = ? WHERE id = ?")->execute([$newStatus, $id]);
            // Optional: Remove from Gallery if set back to pending?
            // $conn->prepare("DELETE FROM $galleryTable WHERE master_id = ?")->execute([$id]);

            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Status updated to Pending.']);
            exit;
        }
    }

    // ==========================================
    // LOGIC FOR LENSES (LINKS)
    // ==========================================
    elseif ($type === 'lens') {
        $masterTable = 'master_lens';
        $galleryTable = 'lens_gallery';

        $stmt = $conn->prepare("SELECT * FROM $masterTable WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) throw new Exception("Lens not found.");

        if ($newStatus === 'rejected') {
            // Just Delete Row (No file to delete)
            $conn->prepare("DELETE FROM $masterTable WHERE id = ?")->execute([$id]);
            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Lens Rejected & Deleted.']);
            exit;
        }

        elseif ($newStatus === 'approved' || $newStatus === 'published') {
            $conn->prepare("UPDATE $masterTable SET status = 'published' WHERE id = ?")->execute([$id]);

            $check = $conn->prepare("SELECT id FROM $galleryTable WHERE master_id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                $sql = "INSERT INTO $galleryTable (master_id, student_name, lens_link, category) VALUES (?, ?, ?, ?)";
                $conn->prepare($sql)->execute([$id, $item['student_name'], $item['lens_link'], $item['category']]);
            }
            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Lens Approved & Published.']);
            exit;
        }
        else {
             $conn->prepare("UPDATE $masterTable SET status = ? WHERE id = ?")->execute([$newStatus, $id]);
             $conn->commit();
             echo json_encode(['status' => 'success', 'message' => 'Status updated.']);
             exit;
        }
    }

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>