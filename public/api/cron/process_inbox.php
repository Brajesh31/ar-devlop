<?php
// public/api/cron/process_inbox.php

// SECURITY: In production, uncomment the line below and use a secret key in your cron URL
// if ($_GET['key'] !== 'YOUR_SECRET_CRON_KEY') exit('Access Denied');

require_once '../../config/db.php';

header('Content-Type: text/plain');
ini_set('display_errors', 1);
set_time_limit(300); // Allow script to run for 5 minutes

$processedLens = 0;
$processedShowcase = 0;

try {
    // We use a transaction to ensure no data is lost during the move
    $conn->beginTransaction();

    // =================================================================
    // 1. PROCESS LENS INBOX (Batch of 50)
    // =================================================================
    $stmtLens = $conn->query("SELECT * FROM inbox_lens WHERE is_processed = 0 LIMIT 50");
    $lensItems = $stmtLens->fetchAll(PDO::FETCH_ASSOC);

    if ($lensItems) {
        $insLens = $conn->prepare("INSERT INTO master_lens
            (account_status, full_name, email, college_name, gender, lens_link, submitted_at)
            VALUES ('guest', ?, ?, ?, ?, ?, ?)");

        $markLens = $conn->prepare("UPDATE inbox_lens SET is_processed = 1 WHERE inbox_id = ?");

        foreach ($lensItems as $row) {
            $insLens->execute([
                $row['raw_name'],
                $row['raw_email'],
                $row['raw_college'],
                $row['gender'],
                $row['lens_link'],
                $row['received_at']
            ]);
            $markLens->execute([$row['inbox_id']]);
            $processedLens++;
        }
    }

    // =================================================================
    // 2. PROCESS SHOWCASE INBOX (Batch of 50)
    // =================================================================
    $stmtVid = $conn->query("SELECT * FROM inbox_showcase WHERE is_processed = 0 LIMIT 50");
    $vidItems = $stmtVid->fetchAll(PDO::FETCH_ASSOC);

    if ($vidItems) {
        $insVid = $conn->prepare("INSERT INTO master_showcase
            (account_status, full_name, email, college_name, project_title, video_url, lens_link, submitted_at)
            VALUES ('guest', ?, ?, ?, ?, ?, ?, ?)");

        $markVid = $conn->prepare("UPDATE inbox_showcase SET is_processed = 1 WHERE inbox_id = ?");

        foreach ($vidItems as $row) {
            $insVid->execute([
                $row['raw_name'],
                $row['raw_email'],
                $row['raw_college'],
                $row['project_title'],
                $row['video_path'],
                $row['lens_link'],
                $row['received_at']
            ]);
            $markVid->execute([$row['inbox_id']]);
            $processedShowcase++;
        }
    }

    // =================================================================
    // 3. THE "MAGIC" SYNC: Guest -> Verified
    // =================================================================
    // This looks for any 'guest' submission where the email matches a registered user
    // and updates the user_id and status.

    // A. Sync Lens Table
    $sqlSyncLens = "UPDATE master_lens m
                    INNER JOIN users u ON m.email = u.email
                    SET m.user_id = u.user_id, m.account_status = 'verified'
                    WHERE m.account_status = 'guest'";
    $conn->exec($sqlSyncLens);

    // B. Sync Showcase Table
    $sqlSyncShowcase = "UPDATE master_showcase m
                        INNER JOIN users u ON m.email = u.email
                        SET m.user_id = u.user_id, m.account_status = 'verified'
                        WHERE m.account_status = 'guest'";
    $conn->exec($sqlSyncShowcase);

    // =================================================================
    // 4. INTELLIGENT COLLEGE MAPPING (For Verified Users Only)
    // =================================================================
    // If we have a user_id, we know their type (Undergrad vs School).
    // We can now check if their typed 'college_name' exists in the Directory.
    // If not, we create it.

    // NOTE: This logic is complex. For speed, we will do a simple update
    // to link existing colleges first.

    // A. Link Undergraduate Colleges
    $sqlLinkColleges = "UPDATE master_showcase m
                        JOIN directory_colleges_ug d ON m.college_name = d.college_name
                        SET m.college_id = d.college_id
                        WHERE m.college_id IS NULL AND m.account_status = 'verified'";
    $conn->exec($sqlLinkColleges);

    $sqlLinkLens = "UPDATE master_lens m
                    JOIN directory_colleges_ug d ON m.college_name = d.college_name
                    SET m.college_id = d.college_id
                    WHERE m.college_id IS NULL AND m.account_status = 'verified'";
    $conn->exec($sqlLinkLens);

    // (You can add similar blocks for directory_schools or directory_colleges_pg if needed)

    $conn->commit();
    echo "SUCCESS: Processed $processedLens Lens items, $processedShowcase Showcase items.";

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "ERROR: " . $e->getMessage();
}
?>