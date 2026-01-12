<?php
// public/api/setup/force_install.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config/db.php';

echo "<h1>🛠️ Master Installation Script</h1>";

try {
    // 1. Create USERS Table (if missing)
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        middle_name VARCHAR(50) NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type ENUM('admin', 'school', 'undergraduate', 'graduate', 'professional') NOT NULL,
        linkedin_url VARCHAR(255) NULL,
        github_url VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sqlUsers);
    echo "<p>✅ 'users' table check passed.</p>";

    // 1.1 Add Missing Columns to Users (Safe Alter)
    $missingCols = [
        'middle_name' => 'VARCHAR(50) NULL AFTER first_name',
        'linkedin_url' => 'VARCHAR(255) NULL',
        'github_url' => 'VARCHAR(255) NULL'
    ];

    foreach ($missingCols as $col => $def) {
        try {
            $conn->query("SELECT $col FROM users LIMIT 1");
        } catch (Exception $e) {
            $conn->exec("ALTER TABLE users ADD COLUMN $col $def");
            echo "<p>➕ Added missing column: <b>$col</b></p>";
        }
    }

    // 2. Create DIRECTORY Tables
    $dirs = [
        'directory_schools' => "CREATE TABLE IF NOT EXISTS directory_schools (
            school_id INT PRIMARY KEY AUTO_INCREMENT,
            school_name VARCHAR(255) UNIQUE NOT NULL,
            dynamic_table_name VARCHAR(100),
            student_count INT DEFAULT 0
        )",
        'directory_colleges_ug' => "CREATE TABLE IF NOT EXISTS directory_colleges_ug (
            college_id INT PRIMARY KEY AUTO_INCREMENT,
            college_name VARCHAR(255) UNIQUE NOT NULL,
            dynamic_table_name VARCHAR(100),
            student_count INT DEFAULT 0
        )",
        'directory_colleges_pg' => "CREATE TABLE IF NOT EXISTS directory_colleges_pg (
            college_id INT PRIMARY KEY AUTO_INCREMENT,
            college_name VARCHAR(255) UNIQUE NOT NULL,
            dynamic_table_name VARCHAR(100),
            student_count INT DEFAULT 0
        )"
    ];

    foreach ($dirs as $name => $sql) {
        $conn->exec($sql);
        echo "<p>✅ Directory Table: <b>$name</b> ready.</p>";
    }

    // 3. Create PROFILE Tables
    $profiles = [
        'profiles_school' => "CREATE TABLE IF NOT EXISTS profiles_school (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            school_id INT NOT NULL,
            class_grade VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )",
        'profiles_undergrad' => "CREATE TABLE IF NOT EXISTS profiles_undergrad (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            college_id INT NOT NULL,
            branch VARCHAR(100),
            stream VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )",
        'profiles_graduate' => "CREATE TABLE IF NOT EXISTS profiles_graduate (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            college_id INT NOT NULL,
            branch VARCHAR(100),
            stream VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )",
        'profiles_professional' => "CREATE TABLE IF NOT EXISTS profiles_professional (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            job_role VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )"
    ];

    foreach ($profiles as $name => $sql) {
        $conn->exec($sql);
        echo "<p>✅ Profile Table: <b>$name</b> ready.</p>";
    }

    // 4. Create SECURITY Tables
    $conn->exec("CREATE TABLE IF NOT EXISTS ip_rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        attempts INT DEFAULT 0,
        blocked_until TIMESTAMP NULL,
        last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (ip_address)
    )");
    echo "<p>✅ Security Table: <b>ip_rate_limits</b> ready.</p>";

    echo "<h2>🎉 Database Successfully Repaired & Installed!</h2>";
    echo "<p><a href='/auth?mode=signup'>Go try Registering again</a></p>";

} catch (PDOException $e) {
    echo "<h2 style='color:red'>❌ Critical Error: " . $e->getMessage() . "</h2>";
}
?>