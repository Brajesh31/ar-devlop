<?php
// public/api/setup/security/init_protection.php

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h1>Initializing Security Layers</h1>";

try {
    $conn->beginTransaction();

    // 1. Update USERS table for Account Locking
    // We add 'failed_attempts' and 'is_locked'
    $check = $conn->query("SHOW COLUMNS FROM users LIKE 'is_locked'");
    if ($check->rowCount() == 0) {
        $conn->exec("ALTER TABLE users
                     ADD COLUMN failed_attempts INT DEFAULT 0,
                     ADD COLUMN is_locked BOOLEAN DEFAULT FALSE,
                     ADD COLUMN locked_at TIMESTAMP NULL");
        echo "<p>✅ Added locking columns to 'users' table.</p>";
    } else {
        echo "<p>⚠️ 'users' table already has locking columns.</p>";
    }

    // 2. Create IP RATE LIMIT Table (Temporary Blocks)
    $conn->exec("CREATE TABLE IF NOT EXISTS ip_rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL, -- IPv4 or IPv6
        attempts INT DEFAULT 0,
        blocked_until TIMESTAMP NULL,
        last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (ip_address)
    )");
    echo "<p>✅ Created 'ip_rate_limits' table.</p>";

    $conn->commit();
    echo "<h2>🎉 Security Database Updated!</h2>";

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "<h2 style='color:red'>❌ Error: " . $e->getMessage() . "</h2>";
}
?>