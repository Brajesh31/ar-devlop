<?php
// public/api/setup/admin/update_security.php

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h2>🔐 Securing Admin Database...</h2>";

try {
    // 1. Add Security Columns to 'admins' table
    // failed_login_attempts: Tracks wrong passwords (to block after 5)
    // is_locked: The 'block' switch
    // password_change_count: Audit log for how many times pass changed

    $sql_alter = "ALTER TABLE admins
                  ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
                  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
                  ADD COLUMN IF NOT EXISTS password_change_count INT DEFAULT 0,
                  ADD COLUMN IF NOT EXISTS last_login DATETIME NULL";

    $conn->exec($sql_alter);
    echo "✅ <b>Admins Table Updated:</b> Added columns for tracking failures and locks.<br><br>";

    // 2. Create 'rate_limits' table
    // This table is used to count requests per IP address per minute
    $sql_rate = "CREATE TABLE IF NOT EXISTS rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        endpoint VARCHAR(50) DEFAULT 'admin_login',
        INDEX (ip_address, attempt_time)
    )";

    $conn->exec($sql_rate);
    echo "✅ <b>Rate Limits Table Created:</b> Ready to block brute-force attacks.<br>";

    echo "<hr><h3>🎉 Database Security Setup Complete.</h3>";
    echo "You can now delete this file.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>