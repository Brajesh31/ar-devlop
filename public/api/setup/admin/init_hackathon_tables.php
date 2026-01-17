<?php
// public/api/setup/admin/init_hackathon_tables.php

// 1. SILENCE OUTPUT & ERROR HANDLING
ob_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../../config/db.php';

echo "<h2>🚀 Initializing Hackathon Architecture...</h2>";

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ====================================================
    // STEP 0: CLEANUP (Drop OLD Hackathon tables only)
    // ====================================================
    // We disable FK checks to allow clean deletion of linked tables
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");

    $tablesToDrop = [
        'hackathon_participants',
        'hackathon_teams',
        'hackathon_registrations_queue',
        'hackathons'
    ];

    foreach ($tablesToDrop as $table) {
        $conn->exec("DROP TABLE IF EXISTS $table");
        echo "🗑️ Dropped old table: <code>$table</code><br>";
    }

    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "<hr>";


    // ====================================================
    // STEP 1: HACKATHONS (The Master Config Table)
    // ====================================================
    // Stores all data from your 'hackathons.ts' file
    $sql_hackathons = "CREATE TABLE hackathons (
        id VARCHAR(64) PRIMARY KEY, -- Slug ID (e.g. 'waves-xr-2025')

        -- Basic Info
        title VARCHAR(255) NOT NULL,
        description TEXT,
        long_description LONGTEXT,

        -- Logistics
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        registration_deadline DATETIME NOT NULL,
        status ENUM('upcoming', 'live', 'completed') DEFAULT 'upcoming',
        mode ENUM('online', 'offline', 'hybrid') DEFAULT 'online',
        location VARCHAR(255),

        -- Logic
        prize_pool VARCHAR(100),
        fee_type ENUM('free', 'paid') DEFAULT 'free',
        fee_amount DECIMAL(10,2) DEFAULT 0.00,

        team_size_type ENUM('solo', 'team') DEFAULT 'team',
        min_team_size INT DEFAULT 1,
        max_team_size INT DEFAULT 5,
        allow_team_creation BOOLEAN DEFAULT TRUE,

        -- Media
        banner_image VARCHAR(255),

        -- JSON Metadata (Stores complex arrays from frontend)
        meta_tracks JSON,
        meta_mentors JSON,
        meta_jury JSON,
        meta_themes JSON,
        meta_timeline JSON,
        meta_prizes JSON,
        meta_faqs JSON,
        meta_partners JSON,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;";

    $conn->exec($sql_hackathons);
    echo "✅ Table <code>hackathons</code> created.<br>";


    // ====================================================
    // STEP 2: REGISTRATION QUEUE (The 'Raw File')
    // ====================================================
    // This is the High-Speed Buffer for 10k registrations/sec
    $sql_queue = "CREATE TABLE hackathon_registrations_queue (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        hackathon_id VARCHAR(64) NOT NULL,

        -- RAW JSON DUMP (Contains Team Code, Team Name, etc.)
        payload_json JSON,

        status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
        attempts INT DEFAULT 0,
        error_log TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_queue_status (status)
    ) ENGINE=InnoDB;";

    $conn->exec($sql_queue);
    echo "✅ Table <code>hackathon_registrations_queue</code> (Raw File) created.<br>";


    // ====================================================
    // STEP 3: HACKATHON TEAMS (The 6-Digit Code)
    // ====================================================
    // Manages the unique codes and team leaders
    $sql_teams = "CREATE TABLE hackathon_teams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        hackathon_id VARCHAR(64) NOT NULL,

        team_name VARCHAR(100) NOT NULL,
        team_code VARCHAR(6) NOT NULL, -- The Unique 6-Digit Code
        leader_user_id INT NOT NULL,   -- Link to EXISTING Users Table

        members_count INT DEFAULT 1,
        status ENUM('active', 'disqualified', 'merged') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- RELATIONS
        FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE,
        FOREIGN KEY (leader_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE KEY unique_code_per_event (hackathon_id, team_code)
    ) ENGINE=InnoDB;";

    $conn->exec($sql_teams);
    echo "✅ Table <code>hackathon_teams</code> created.<br>";


    // ====================================================
    // STEP 4: HACKATHON PARTICIPANTS (The Link Table)
    // ====================================================
    // This is the main table that links Users to the Event
    $sql_participants = "CREATE TABLE hackathon_participants (
        id INT PRIMARY KEY AUTO_INCREMENT,

        -- The Core Links
        user_id INT NOT NULL,
        hackathon_id VARCHAR(64) NOT NULL,
        team_id INT NULL,

        -- Snapshot Data (Name at time of registration)
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),

        -- Status
        role ENUM('leader', 'member', 'solo') DEFAULT 'solo',
        registration_status ENUM('pending', 'approved', 'waitlisted', 'rejected') DEFAULT 'approved',

        -- Certificates
        certificate_issued BOOLEAN DEFAULT FALSE,
        certificate_id VARCHAR(100) NULL,

        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- FOREIGN KEYS (The Links)
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES hackathon_teams(id) ON DELETE SET NULL,

        UNIQUE KEY unique_participation (user_id, hackathon_id)
    ) ENGINE=InnoDB;";

    $conn->exec($sql_participants);
    echo "✅ Table <code>hackathon_participants</code> created (Linked to Users & Teams).<br>";

    echo "<hr><h3>🎉 Architecture Ready.</h3>";
    echo "<b>Tables Created:</b> hackathons, hackathon_registrations_queue, hackathon_teams, hackathon_participants.<br>";
    echo "<b>Relations:</b> Linked to existing 'users' table.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Database Error:</h3> " . $e->getMessage();
} catch(Exception $e) {
    echo "<h3 style='color:red'>❌ General Error:</h3> " . $e->getMessage();
}
?>