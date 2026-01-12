<?php
// public/api/setup/student/init_db.php

// 1. Setup & Config
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h1>Initializing Student Panel Database (v2 - Relational)</h1>";

try {
    $conn->beginTransaction();

    // =================================================================
    // 1. MASTER USERS TABLE (Authentication)
    // =================================================================
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        middle_name VARCHAR(50) NULL,
        last_name VARCHAR(50) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL, -- Stored without +91
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,

        -- Profile Links
        linkedin_url VARCHAR(255) NULL,
        github_url VARCHAR(255) NULL,

        -- Role Logic
        user_type ENUM('school', 'undergraduate', 'graduate', 'professional') NOT NULL,

        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX (email),
        INDEX (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    echo "<p>✅ Master 'users' table ready.</p>";

    // =================================================================
    // 2. DIRECTORY TABLES (The Master Lists)
    // =================================================================
    // These tables store the unique names. When a new row is added here,
    // your backend logic will create a corresponding "dynamic_table_name".

    // A. School Directory
    $conn->exec("CREATE TABLE IF NOT EXISTS directory_schools (
        school_id INT PRIMARY KEY AUTO_INCREMENT,
        school_name VARCHAR(255) UNIQUE NOT NULL,
        dynamic_table_name VARCHAR(255) NULL, -- e.g. 'school_1_dps_mathura'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "<p>✅ 'directory_schools' created.</p>";

    // B. Undergraduate College Directory
    $conn->exec("CREATE TABLE IF NOT EXISTS directory_colleges_ug (
        college_id INT PRIMARY KEY AUTO_INCREMENT,
        college_name VARCHAR(255) UNIQUE NOT NULL,
        dynamic_table_name VARCHAR(255) NULL, -- e.g. 'college_ug_1_iit_delhi'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "<p>✅ 'directory_colleges_ug' created.</p>";

    // C. Graduate College Directory
    $conn->exec("CREATE TABLE IF NOT EXISTS directory_colleges_pg (
        college_id INT PRIMARY KEY AUTO_INCREMENT,
        college_name VARCHAR(255) UNIQUE NOT NULL,
        dynamic_table_name VARCHAR(255) NULL, -- e.g. 'college_pg_1_iit_bombay'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "<p>✅ 'directory_colleges_pg' created.</p>";

    // =================================================================
    // 3. PROFILE TABLES (Relations)
    // =================================================================
    // These link the User to the Directory.

    // A. School Student Profile
    $conn->exec("CREATE TABLE IF NOT EXISTS profiles_school (
        profile_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        school_id INT NOT NULL,  -- RELATES TO directory_schools
        class_grade VARCHAR(50) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (school_id) REFERENCES directory_schools(school_id) ON DELETE CASCADE
    )");
    echo "<p>✅ 'profiles_school' created with Relations.</p>";

    // B. Undergraduate Profile
    $conn->exec("CREATE TABLE IF NOT EXISTS profiles_undergrad (
        profile_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        college_id INT NOT NULL, -- RELATES TO directory_colleges_ug
        branch VARCHAR(100) NOT NULL,
        stream VARCHAR(100) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (college_id) REFERENCES directory_colleges_ug(college_id) ON DELETE CASCADE
    )");
    echo "<p>✅ 'profiles_undergrad' created with Relations.</p>";

    // C. Graduate Profile
    $conn->exec("CREATE TABLE IF NOT EXISTS profiles_graduate (
        profile_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        college_id INT NOT NULL, -- RELATES TO directory_colleges_pg
        branch VARCHAR(100) NOT NULL,
        stream VARCHAR(100) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (college_id) REFERENCES directory_colleges_pg(college_id) ON DELETE CASCADE
    )");
    echo "<p>✅ 'profiles_graduate' created with Relations.</p>";

    // D. Professional Profile (No Directory needed, just role)
    $conn->exec("CREATE TABLE IF NOT EXISTS profiles_professional (
        profile_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        job_role VARCHAR(150) NOT NULL,

        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )");
    echo "<p>✅ 'profiles_professional' created.</p>";

    $conn->commit();
    echo "<h2>🎉 Database Setup Complete!</h2>";
    echo "<p>Tables created: users, directories (3), profiles (4).</p>";

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo "<h2 style='color:red'>❌ Error: " . $e->getMessage() . "</h2>";
}
?>