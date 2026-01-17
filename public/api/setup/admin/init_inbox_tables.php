<?php
// public/api/setup/admin/init_inbox_tables.php

header('Content-Type: text/plain');
require_once '../../config/db.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Starting Inbox Tables Upgrade...\n\n";

    // ==========================================
    // 0. CLEANUP (Drop old inboxes to rebuild)
    // ==========================================
    // WARNING: This clears current pending submissions.
    // If you have important data, back it up first.
    $conn->exec("DROP TABLE IF EXISTS inbox_showcase");
    $conn->exec("DROP TABLE IF EXISTS inbox_lens");
    echo "[OK] Old Inbox tables cleaned up.\n";

    // ==========================================
    // 1. INBOX SHOWCASE (Temporary Holding)
    // ==========================================
    $sqlInboxShowcase = "CREATE TABLE inbox_showcase (
        inbox_id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,                 -- Linked if email matches

        -- Raw User Input
        raw_name VARCHAR(255),
        raw_email VARCHAR(255),
        raw_college VARCHAR(255),
        gender VARCHAR(50),

        -- Project Details (New Fields Added)
        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),

        -- Media
        video_path VARCHAR(500),
        lens_link VARCHAR(500),

        -- System Meta
        submission_ip VARCHAR(45),
        is_processed TINYINT(1) DEFAULT 0,    -- 0=New, 1=Moved to Master
        account_status VARCHAR(50) DEFAULT 'guest',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (inbox_id),
        KEY idx_is_processed (is_processed),
        KEY idx_raw_email (raw_email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlInboxShowcase);
    echo "[OK] Table 'inbox_showcase' created with new columns.\n";

    // ==========================================
    // 2. INBOX LENS (Temporary Holding)
    // ==========================================
    $sqlInboxLens = "CREATE TABLE inbox_lens (
        inbox_id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,

        raw_name VARCHAR(255),
        raw_email VARCHAR(255),
        raw_college VARCHAR(255),
        gender VARCHAR(50),

        lens_link VARCHAR(500),
        category VARCHAR(100) DEFAULT 'Lens',

        submission_ip VARCHAR(45),
        is_processed TINYINT(1) DEFAULT 0,
        account_status VARCHAR(50) DEFAULT 'guest',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (inbox_id),
        KEY idx_lens_processed (is_processed)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlInboxLens);
    echo "[OK] Table 'inbox_lens' created.\n";

    echo "\nSUCCESS: Inbox tables are now compatible with Master tables.";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>