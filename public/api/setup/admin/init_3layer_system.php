<?php
// public/api/setup/admin/init_3layer_system.php

header('Content-Type: text/plain');
require_once '../../../config/db.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Starting Robust 3-Layer Architecture Setup...\n\n";

    // ==========================================
    // 0. SAFE CLEANUP (Drop Child Tables First)
    // ==========================================
    // We disable FK checks momentarily to drop tables cleanly
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    $conn->exec("DROP TABLE IF EXISTS showcase_gallery");
    $conn->exec("DROP TABLE IF EXISTS lens_gallery");
    $conn->exec("DROP TABLE IF EXISTS master_showcase");
    $conn->exec("DROP TABLE IF EXISTS master_lens");
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "[OK] Old tables cleaned up.\n";

    // ==========================================
    // 1. MASTER SHOWCASE (Parent Table)
    // ==========================================
    $sqlMasterShowcase = "CREATE TABLE master_showcase (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,
        student_name VARCHAR(255),
        email VARCHAR(255),
        college_name VARCHAR(255),
        gender VARCHAR(50),

        -- Full Project Details
        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),

        -- Media
        video_path VARCHAR(500),
        lens_link VARCHAR(500),

        -- Admin Status
        status VARCHAR(50) DEFAULT 'pending',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- KEYS & RELATIONS
        PRIMARY KEY (id),
        KEY idx_user_id (user_id),
        CONSTRAINT fk_master_showcase_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlMasterShowcase);
    echo "[OK] Table 'master_showcase' created with Relations.\n";

    // ==========================================
    // 2. MASTER LENS (Parent Table)
    // ==========================================
    $sqlMasterLens = "CREATE TABLE master_lens (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NULL,
        student_name VARCHAR(255),
        email VARCHAR(255),
        college_name VARCHAR(255),
        gender VARCHAR(50),

        lens_link VARCHAR(500),
        category VARCHAR(100) DEFAULT 'Lens',

        status VARCHAR(50) DEFAULT 'pending',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- KEYS & RELATIONS
        PRIMARY KEY (id),
        KEY idx_lens_user_id (user_id),
        CONSTRAINT fk_master_lens_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlMasterLens);
    echo "[OK] Table 'master_lens' created with Relations.\n";

    // ==========================================
    // 3. SHOWCASE GALLERY (Child Table)
    // ==========================================
    $sqlGalleryShowcase = "CREATE TABLE showcase_gallery (
        id INT(11) NOT NULL AUTO_INCREMENT,
        master_id INT(11) NOT NULL,

        -- Data Cache (For Fast Frontend Loading)
        student_name VARCHAR(255),
        college_name VARCHAR(255),
        project_title VARCHAR(255),
        project_description TEXT,
        category VARCHAR(100),
        tech_stack VARCHAR(500),
        video_url VARCHAR(500),
        lens_link VARCHAR(500),

        -- Public Stats
        views INT(11) DEFAULT 0,
        likes INT(11) DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- KEYS & RELATIONS (The Lines!)
        PRIMARY KEY (id),
        KEY idx_gallery_master (master_id),
        CONSTRAINT fk_gallery_showcase_master FOREIGN KEY (master_id) REFERENCES master_showcase(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlGalleryShowcase);
    echo "[OK] Table 'showcase_gallery' created. Relation line to 'master_showcase' established.\n";

    // ==========================================
    // 4. LENS GALLERY (Child Table)
    // ==========================================
    $sqlGalleryLens = "CREATE TABLE lens_gallery (
        id INT(11) NOT NULL AUTO_INCREMENT,
        master_id INT(11) NOT NULL,

        student_name VARCHAR(255),
        lens_link VARCHAR(500),
        category VARCHAR(100) DEFAULT 'Lens',

        views INT(11) DEFAULT 0,
        likes INT(11) DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- KEYS & RELATIONS
        PRIMARY KEY (id),
        KEY idx_gallery_lens_master (master_id),
        CONSTRAINT fk_gallery_lens_master FOREIGN KEY (master_id) REFERENCES master_lens(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sqlGalleryLens);
    echo "[OK] Table 'lens_gallery' created. Relation line to 'master_lens' established.\n";

    echo "\nSUCCESS: Full 3-Layer Architecture is ready! Check Designer View to see the lines.";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>