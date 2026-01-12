<?php
// File: public/api/setup/admin/install.php

// Disable error reporting for production (enable for debugging if needed)
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: text/html; charset=UTF-8");

// 1. Database Credentials
$host = "localhost";
$db_name = "u288920822_BHARATXR";
$username = "u288920822_BHARATXRSQL";
$password = "bK@31012004";

try {
    // 2. Connect to Database
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h3>🔌 Database Connection Successful...</h3>";

    // 3. Create 'admins' Table
    // We add 'is_permanent' to protect your super admin accounts
    $sql = "CREATE TABLE IF NOT EXISTS admins (
        admin_id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
        is_permanent BOOLEAN DEFAULT FALSE,
        full_name VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        status ENUM('active', 'inactive') DEFAULT 'active'
    )";

    $conn->exec($sql);
    echo "✅ Table 'admins' checked/created successfully.<br>";

    // 4. Define Permanent Super Admins
    $super_admins = [
        [
            'email' => 'arexa.dev@gmail.com',
            'pass' => 'pimga9-tostoq-faBhej',
            'name' => 'Arexa Dev'
        ],
        [
            'email' => 'chhavi@arexa.co',
            'pass' => 'xyjmu0-waqfaq-qIszod',
            'name' => 'Chhavi'
        ],
        [
            'email' => 'bk117134@gmail.com',
            'pass' => 'brajesh3101004',
            'name' => 'Brajesh Kumar'
        ]
    ];

    // 5. Insert Admins securely
    $insertStmt = $conn->prepare("INSERT INTO admins (email, password_hash, role, is_permanent, full_name, status) VALUES (:email, :hash, 'super_admin', TRUE, :name, 'active')");
    $checkStmt = $conn->prepare("SELECT email FROM admins WHERE email = :email");
    $updateStmt = $conn->prepare("UPDATE admins SET password_hash = :hash, is_permanent = TRUE WHERE email = :email");

    echo "<hr><h3>👤 Setting up Super Admins...</h3>";

    foreach ($super_admins as $admin) {
        // Hash the password securely
        $hashed_password = password_hash($admin['pass'], PASSWORD_BCRYPT);

        // Check if admin already exists
        $checkStmt->execute([':email' => $admin['email']]);

        if ($checkStmt->rowCount() == 0) {
            // Create new
            $insertStmt->execute([
                ':email' => $admin['email'],
                ':hash' => $hashed_password,
                ':name' => $admin['name']
            ]);
            echo "<span style='color:green'>Created:</span> " . $admin['email'] . "<br>";
        } else {
            // Update existing (ensures password matches what you have on file)
            $updateStmt->execute([
                ':hash' => $hashed_password,
                ':email' => $admin['email']
            ]);
            echo "<span style='color:blue'>Updated (Password Synced):</span> " . $admin['email'] . "<br>";
        }
    }

    echo "<hr><h3>🎉 Admin Setup Complete.</h3>";
    echo "You can now access this script via: <code>your-domain.com/api/setup/admin/install.php</code><br>";
    echo "<strong>Security Warning:</strong> Please delete this file or folder after running it successfully.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>