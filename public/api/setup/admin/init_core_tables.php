<?php
// public/api/setup/admin/init_core_tables.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../../config/db.php';

echo "<h2>🏗️ Initializing Core Database Tables...</h2>";

try {
    // 1. STUDENTS Table
    $sql_students = "CREATE TABLE IF NOT EXISTS students (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        college_name VARCHAR(150),
        phone VARCHAR(20),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('active', 'blocked') DEFAULT 'active'
    )";
    $conn->exec($sql_students);
    echo "✅ Table <code>students</code> created.<br>";

    // 2. EVENTS Table
    $sql_events = "CREATE TABLE IF NOT EXISTS events (
        event_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE,
        description TEXT,
        start_date DATETIME NOT NULL,
        end_date DATETIME,
        mode ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online',
        status ENUM('draft', 'published', 'completed') DEFAULT 'draft',
        created_by INT, -- Admin ID
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql_events);
    echo "✅ Table <code>events</code> created.<br>";

    // 3. HACKATHONS Table
    $sql_hackathons = "CREATE TABLE IF NOT EXISTS hackathons (
        hackathon_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        theme VARCHAR(255),
        registration_start DATETIME,
        registration_end DATETIME,
        event_start DATETIME,
        status ENUM('upcoming', 'live', 'ended') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql_hackathons);
    echo "✅ Table <code>hackathons</code> created.<br>";

    echo "<hr><h3>🎉 Core Tables Setup Complete.</h3>";
    echo "You can now proceed to create the Dashboard API.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>