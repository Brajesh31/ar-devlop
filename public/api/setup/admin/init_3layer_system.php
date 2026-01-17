<?php
// public/api/setup/admin/init_3layer_system.php

header('Content-Type: text/plain');
require_once '../../../config/db.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Starting 3-Layer Architecture Setup...\n\n";

    // ==========================================
    // 1. MASTER TABLES (The Admin's Internal Record)
    // ==========================================

    // Master Showcase (Videos)
    $sqlMasterShowcase = "CREATE TABLE IF NOT EXISTS master_showcase (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        student_name VARCHAR(255),
        email VARCHAR(255),
        college_name VARCHAR(255),
        gender VARCHAR(50),
        project_title VARCHAR(255),
        video_path VARCHAR(500),
        lens_link VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB;";

    $conn->exec($sqlMasterShowcase);
    echo "[OK] Table 'master_showcase' created or already exists.\n";

    // Master Lens (Links)
    $sqlMasterLens = "CREATE TABLE IF NOT EXISTS master_lens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        student_name VARCHAR(255),
        email VARCHAR(255),
        college_name VARCHAR(255),
        gender VARCHAR(50),
        lens_link VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending',
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB;";

    $conn->exec($sqlMasterLens);
    echo "[OK] Table 'master_lens' created or already exists.\n";

    // ==========================================
    // 2. GALLERY TABLES (Public Website Display)
    // ==========================================

    // Showcase Gallery (Approved Videos)
    $sqlGalleryShowcase = "CREATE TABLE IF NOT EXISTS showcase_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        master_id INT NOT NULL,
        student_name VARCHAR(255),
        college_name VARCHAR(255),
        project_title VARCHAR(255),
        video_url VARCHAR(500),
        lens_link VARCHAR(500),
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES master_showcase(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;";

    $conn->exec($sqlGalleryShowcase);
    echo "[OK] Table 'showcase_gallery' created or already exists.\n";

    // Lens Gallery (Approved Lenses)
    $sqlGalleryLens = "CREATE TABLE IF NOT EXISTS lens_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        master_id INT NOT NULL,
        student_name VARCHAR(255),
        lens_link VARCHAR(500),
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES master_lens(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;";

    $conn->exec($sqlGalleryLens);
    echo "[OK] Table 'lens_gallery' created or already exists.\n";

    echo "\nSUCCESS: All 4 tables are ready for the new architecture.";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>