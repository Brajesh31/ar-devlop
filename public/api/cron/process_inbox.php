<?php
// public/api/cron/process_inbox.php

// 1. CONFIGURATION
// Relative path to api/config/db.php from api/cron/
require_once '../config/db.php';

header('Content-Type: text/plain');
ini_set('display_errors', 1);
set_time_limit(300); // Allow 5 minutes execution time

$movedVideos = 0;
$movedLenses = 0;

try {
    $conn->beginTransaction();

    // =================================================================
    // 1. MOVE VIDEOS: Inbox -> Master Showcase
    // =================================================================
    // Select batch of 100 (High Volume Processing)
    $stmtVid = $conn->query("SELECT * FROM inbox_showcase LIMIT 100");
    $videos = $stmtVid->fetchAll(PDO::FETCH_ASSOC);

    if ($videos) {
        // Prepare Insert into Master (Default status: pending)
        $insMaster = $conn->prepare("INSERT INTO master_showcase
            (student_name, email, phone, college_name, gender,
             project_title, project_description, category, tech_stack,
             video_path, lens_link, status, received_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)");

        // Prepare Delete from Inbox
        $delInbox = $conn->prepare("DELETE FROM inbox_showcase WHERE inbox_id = ?");

        foreach ($videos as $row) {
            // 1. Insert into Master List
            $insMaster->execute([
                $row['raw_name'],
                $row['raw_email'],
                $row['raw_phone'],
                $row['raw_college'],
                $row['gender'],
                $row['project_title'],
                $row['project_description'],
                $row['category'],
                $row['tech_stack'],
                $row['video_path'],
                $row['lens_link'],
                $row['received_at']
            ]);

            // 2. Delete from Inbox (Keep it clean!)
            $delInbox->execute([$row['inbox_id']]);
            $movedVideos++;
        }
    }

    // =================================================================
    // 2. MOVE LENSES: Inbox -> Master Lens
    // =================================================================
    $stmtLens = $conn->query("SELECT * FROM inbox_lens LIMIT 100");
    $lenses = $stmtLens->fetchAll(PDO::FETCH_ASSOC);

    if ($lenses) {
        $insMasterLens = $conn->prepare("INSERT INTO master_lens
            (student_name, email, phone, college_name, gender,
             lens_link, category, status, received_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)");

        $delInboxLens = $conn->prepare("DELETE FROM inbox_lens WHERE inbox_id = ?");

        foreach ($lenses as $row) {
            $insMasterLens->execute([
                $row['raw_name'],
                $row['raw_email'],
                $row['raw_phone'],
                $row['raw_college'],
                $row['gender'],
                $row['lens_link'],
                $row['category'],
                $row['received_at']
            ]);
            $delInboxLens->execute([$row['inbox_id']]);
            $movedLenses++;
        }
    }

    // =================================================================
    // 3. MAGIC SYNC (Link Registered Users)
    // =================================================================
    // This connects the submission to the Student Dashboard via Email

    // Sync Showcase
    $conn->exec("UPDATE master_showcase m
                 INNER JOIN users u ON m.email = u.email
                 SET m.user_id = u.user_id
                 WHERE m.user_id IS NULL");

    // Sync Lenses
    $conn->exec("UPDATE master_lens m
                 INNER JOIN users u ON m.email = u.email
                 SET m.user_id = u.user_id
                 WHERE m.user_id IS NULL");

    $conn->commit();
    echo "SUCCESS: Processed $movedVideos Videos and $movedLenses Lenses. Inbox Cleared.";

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "ERROR: " . $e->getMessage();
}
?>