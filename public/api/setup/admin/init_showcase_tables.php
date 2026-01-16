<?php
// public/api/setup/admin/init_showcase_tables.php
// --------------------------------------------------------
// PURPOSE: Creates the "Inbox" (High Speed) and "Master" (Storage) tables
// RELATIONSHIPS: Links Master tables to the core 'users' table
// --------------------------------------------------------

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Adjust this path if necessary to point to your config file
require_once '../../config/db.php';

echo "<h2>🚀 Initializing Showcase & Lens Architecture...</h2>";

try {
    $conn->beginTransaction();

    // =========================================================
    // 1. INBOX TABLES (High-Speed Write, No Constraints)
    // =========================================================
    // These act as the "Queue". No Foreign Keys here to prevent
    // bottlenecks during high traffic.

    // A. Inbox for Video Projects
    $conn->exec("CREATE TABLE IF NOT EXISTS inbox_showcase (
        inbox_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        raw_name VARCHAR(100),
        raw_email VARCHAR(150),
        raw_college VARCHAR(255),
        project_title VARCHAR(255),
        video_path VARCHAR(255),
        lens_link VARCHAR(500),
        submission_ip VARCHAR(45),
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_processed BOOLEAN DEFAULT FALSE,

        INDEX idx_process (is_processed)
    ) ENGINE=InnoDB");
    echo "✅ Table <code>inbox_showcase</code> created.<br>";

    // B. Inbox for Lens Links
    $conn->exec("CREATE TABLE IF NOT EXISTS inbox_lens (
        inbox_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        raw_name VARCHAR(100),
        raw_email VARCHAR(150),
        raw_college VARCHAR(255),
        lens_link VARCHAR(500),
        gender VARCHAR(20),
        submission_ip VARCHAR(45),
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_processed BOOLEAN DEFAULT FALSE,

        INDEX idx_process (is_processed)
    ) ENGINE=InnoDB");
    echo "✅ Table <code>inbox_lens</code> created.<br>";


    // =========================================================
    // 2. MASTER TABLES (Verified Storage, Relational)
    // =========================================================
    // These hold the final data. They link to your 'users' table.

    // A. Master Showcase (Videos)
    $conn->exec("CREATE TABLE IF NOT EXISTS master_showcase (
        submission_id BIGINT PRIMARY KEY AUTO_INCREMENT,

        -- STATUS FLAGS
        account_status ENUM('guest', 'verified') DEFAULT 'guest',
        admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        is_featured BOOLEAN DEFAULT FALSE, -- For Main Page Video

        -- RELATIONS
        user_id INT NULL,
        college_id INT NULL, -- Logical Link to directory_schools/_ug/_pg

        -- DATA
        full_name VARCHAR(100),
        email VARCHAR(150),
        college_name VARCHAR(255),
        project_title VARCHAR(255),
        video_url VARCHAR(255),
        lens_link VARCHAR(500),

        submitted_at DATETIME,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- INDEXES FOR SPEED
        INDEX idx_email (email),
        INDEX idx_status (admin_status),
        INDEX idx_college (college_name),
        INDEX idx_featured (is_featured),

        -- CONSTRAINT: Link to Users Table
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    echo "✅ Table <code>master_showcase</code> created with Relations.<br>";

    // B. Master Lens (Links)
    $conn->exec("CREATE TABLE IF NOT EXISTS master_lens (
        submission_id BIGINT PRIMARY KEY AUTO_INCREMENT,

        -- STATUS FLAGS
        account_status ENUM('guest', 'verified') DEFAULT 'guest',

        -- RELATIONS
        user_id INT NULL,
        college_id INT NULL, -- Logical Link to directory_schools/_ug/_pg

        -- DATA
        full_name VARCHAR(100),
        email VARCHAR(150),
        college_name VARCHAR(255),
        lens_link VARCHAR(500),
        gender VARCHAR(20),

        submitted_at DATETIME,

        -- INDEXES
        INDEX idx_email (email),
        INDEX idx_college (college_name),
        INDEX idx_date (submitted_at),

        -- CONSTRAINT: Link to Users Table
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    ) ENGINE=InnoDB");
    echo "✅ Table <code>master_lens</code> created with Relations.<br>";

    $conn->commit();
    echo "<hr><h3>🎉 Database Architecture Complete.</h3>";
    echo "<p>Inbox tables are ready for high-speed writing.<br>";
    echo "Master tables are linked to <code>users</code> via Foreign Keys.</p>";

} catch (PDOException $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>