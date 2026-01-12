<?php
// public/api/setup/admin/update_security.php
require_once '../../config/db.php';

try {
    // 1. Add Security Columns to 'admins' table
    // failed_login_attempts: Counts wrong passwords
    // is_locked: Blocks login if true
    // password_change_count: Audit trail
    // last_login: Ensure it exists (and we'll use it for timestamps)

    $sql_alter = "ALTER TABLE admins
                  ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
                  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
                  ADD COLUMN IF NOT EXISTS password_change_count INT DEFAULT 0";

    $conn->exec($sql_alter);
    echo "<h3>✅ Admin Table Updated (Security Columns Added)</h3>";

    // 2. Create 'rate_limits' table
    // This tracks login attempts by IP address for the 1-minute block
    $sql_rate = "CREATE TABLE IF NOT EXISTS rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        endpoint VARCHAR(50) DEFAULT 'admin_login',
        INDEX (ip_address, attempt_time)
    )";

    $conn->exec($sql_rate);
    echo "<h3>✅ Rate Limits Table Created</h3>";

} catch(PDOException $e) {
    echo "<h3>❌ Error:</h3> " . $e->getMessage();
}
?>