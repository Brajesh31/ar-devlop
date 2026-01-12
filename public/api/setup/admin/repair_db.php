<?php
// public/api/setup/repair_db.php
// RUN THIS TO FIX "DATABASE ERROR" ISSUES

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h2>🛠️ Starting Database Repair...</h2>";

try {
    $columns_to_add = [
        "reset_token_hash" => "VARCHAR(255) NULL",
        "reset_token_expires_at" => "DATETIME NULL",
        "failed_login_attempts" => "INT DEFAULT 0",
        "is_locked" => "BOOLEAN DEFAULT FALSE",
        "password_change_count" => "INT DEFAULT 0",
        "last_login" => "DATETIME NULL",
        "status" => "ENUM('active', 'inactive') DEFAULT 'active'",
        "is_permanent" => "BOOLEAN DEFAULT FALSE",
        "full_name" => "VARCHAR(100) DEFAULT 'Admin'"
    ];

    foreach ($columns_to_add as $column => $definition) {
        // Check if column exists
        $check = $conn->prepare("SHOW COLUMNS FROM admins LIKE :col");
        $check->execute([':col' => $column]);

        if ($check->rowCount() == 0) {
            // Column missing, add it
            echo "⚠️ Column <code>$column</code> is MISSING. Adding it... ";
            $conn->exec("ALTER TABLE admins ADD COLUMN $column $definition");
            echo "<span style='color:green'>Done.</span><br>";
        } else {
            echo "✅ Column <code>$column</code> exists.<br>";
        }
    }

    // Also ensure rate_limits table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        endpoint VARCHAR(50) DEFAULT 'admin_login',
        INDEX (ip_address, attempt_time)
    )");
    echo "✅ Table <code>rate_limits</code> checked.<br>";

    echo "<hr><h3 style='color:green'>🎉 Database Repair Complete!</h3>";
    echo "Try resetting your password again now.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Critical Error:</h3> " . $e->getMessage();
}
?>