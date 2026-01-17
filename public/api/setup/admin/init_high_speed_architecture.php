<?php
// public/api/setup/admin/init_high_speed_architecture.php

header('Content-Type: text/plain');
require_once '../../config/db.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "=== 🚀 BUILDING HIGH-SPEED ARCHITECTURE (WITH RELATIONS) ===\n\n";

    // ---------------------------------------------------------
    // 1. CLEANUP (Drop Old Tables)
    // ---------------------------------------------------------
    // We disable foreign key checks temporarily to delete tables in any order
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");

    $tables = [
        'showcase_gallery', 'lens_gallery', // Frontend Layer (Child)
        'master_showcase', 'master_lens',   // Admin Layer (Parent)
        'inbox_showcase', 'inbox_lens'      // Ingestion Layer (Dump)
    ];

    echo "[1/4] Dropping old tables...\n";
    foreach ($tables as $tb) {
        $conn->exec("DROP TABLE IF EXISTS $tb");
        echo " - Deleted $tb\n";
    }
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");


    // ---------------------------------------------------------
    // 2. INGESTION LAYER (The "Dump" Tables)
    // ---------------------------------------------------------
    // Optimized for speed (5000/min). No Foreign Keys here to avoid lookup locks.
    echo "\n[2/4] Creating Ingestion Layer (Inbox)...\n";

    // Inbox Showcase (Video)
    $conn->exec("CREATE TABLE inbox_showcase (
        inbox_id INT(11) NOT NULL AUTO_INCREMENT,

        -- Raw Inputs
        raw_name VARCHAR(255),
        raw_email VARCHAR(255),
        raw_phone VARCHAR(50),      -- Added Phone
        raw_college VARCHAR(255),
        gender VARCHAR(50),

        -- Project Details
        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),

        -- Media
        video_path VARCHAR(500),    -- Stores path like '/uploads/videos/x.mp4'
        lens_link VARCHAR(500),

        -- System
        submission_ip VARCHAR(45),
        is_processed TINYINT(1) DEFAULT 0,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (inbox_id),
        KEY idx_processed (is_processed) -- Fast index for Cron Job
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'inbox_showcase'\n";

    // Inbox Lens (Link)
    $conn->exec("CREATE TABLE inbox_lens (
        inbox_id INT(11) NOT NULL AUTO_INCREMENT,

        raw_name VARCHAR(255),
        raw_email VARCHAR(255),
        raw_phone VARCHAR(50),
        raw_college VARCHAR(255),
        gender VARCHAR(50),

        lens_link VARCHAR(500),
        category VARCHAR(100) DEFAULT 'Lens',

        submission_ip VARCHAR(45),
        is_processed TINYINT(1) DEFAULT 0,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (inbox_id),
        KEY idx_lens_processed (is_processed)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'inbox_lens'\n";


    // ---------------------------------------------------------
    // 3. MASTER LAYER (Admin Layer with Relations)
    // ---------------------------------------------------------
    // This is where the relations happen. We link to the 'users' table.
    echo "\n[3/4] Creating Master Layer (Linked to Users)...\n";

    // Master Showcase
    $conn->exec("CREATE TABLE master_showcase (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,       -- LINK TO USERS TABLE

        student_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        college_name VARCHAR(255),
        gender VARCHAR(50),

        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),

        video_path VARCHAR(500),
        lens_link VARCHAR(500),

        status VARCHAR(50) DEFAULT 'pending', -- pending, published
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        KEY idx_user (user_id),

        -- THE RELATION LINE:
        CONSTRAINT fk_master_showcase_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'master_showcase' with User Relation\n";

    // Master Lens
    $conn->exec("CREATE TABLE master_lens (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,       -- LINK TO USERS TABLE

        student_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        college_name VARCHAR(255),
        gender VARCHAR(50),

        lens_link VARCHAR(500),
        category VARCHAR(100),

        status VARCHAR(50) DEFAULT 'pending',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        KEY idx_lens_user (user_id),

        -- THE RELATION LINE:
        CONSTRAINT fk_master_lens_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'master_lens' with User Relation\n";


    // ---------------------------------------------------------
    // 4. GALLERY LAYER (Frontend Display)
    // ---------------------------------------------------------
    // Linked to Master. If Admin deletes Master, Gallery entry is deleted too.
    echo "\n[4/4] Creating Gallery Layer (Linked to Master)...\n";

    // Showcase Gallery
    $conn->exec("CREATE TABLE showcase_gallery (
        id INT(11) NOT NULL AUTO_INCREMENT,
        master_id INT(11) NOT NULL, -- LINK TO MASTER TABLE

        -- Cached Data for Fast Frontend Reading
        student_name VARCHAR(255),
        college_name VARCHAR(255),

        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),

        video_url VARCHAR(500),
        lens_link VARCHAR(500),

        -- Analytics
        views INT(11) DEFAULT 0,
        likes INT(11) DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        KEY idx_master (master_id),

        -- THE RELATION LINE:
        CONSTRAINT fk_gallery_showcase_master
        FOREIGN KEY (master_id) REFERENCES master_showcase(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'showcase_gallery' with Master Relation\n";

    // Lens Gallery
    $conn->exec("CREATE TABLE lens_gallery (
        id INT(11) NOT NULL AUTO_INCREMENT,
        master_id INT(11) NOT NULL, -- LINK TO MASTER TABLE

        student_name VARCHAR(255),
        lens_link VARCHAR(500),
        category VARCHAR(100),

        views INT(11) DEFAULT 0,
        likes INT(11) DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        KEY idx_lens_master (master_id),

        -- THE RELATION LINE:
        CONSTRAINT fk_gallery_lens_master
        FOREIGN KEY (master_id) REFERENCES master_lens(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo " - Created 'lens_gallery' with Master Relation\n";

    echo "\nSUCCESS: Full 3-Layer Architecture is ready with all relationships.";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>