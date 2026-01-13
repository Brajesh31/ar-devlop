<?php
// public/api/setup/update_security_columns.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Fix Path logic
if (file_exists('../config/db.php')) {
    require_once '../config/db.php';
} elseif (file_exists('../../config/db.php')) {
    require_once '../../config/db.php';
} else {
    die("❌ Critical Error: Could not find db.php.");
}

echo "<h1>🛡️ Updating Database Security...</h1>";

try {
    // 1. Add Security Columns to 'users' table
    $columns = [
        'failed_attempts' => "INT DEFAULT 0",
        'is_locked'       => "TINYINT(1) DEFAULT 0",
        'locked_at'       => "DATETIME NULL",
        'reset_token'     => "VARCHAR(255) NULL",
        'reset_expiry'    => "DATETIME NULL"
    ];

    echo "<h3>Checking 'users' table...</h3>";
    foreach ($columns as $col => $def) {
        try {
            $conn->query("SELECT $col FROM users LIMIT 1");
            echo "<p style='color:gray'>👌 Column <b>$col</b> already exists.</p>";
        } catch (Exception $e) {
            $conn->exec("ALTER TABLE users ADD COLUMN $col $def");
            echo "<p style='color:green'>✅ Added column: <b>$col</b></p>";
        }
    }

    // 2. Ensure IP Rate Limit Table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS ip_rate_limits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ip_address VARCHAR(45) NOT NULL,
        attempts INT DEFAULT 0,
        blocked_until TIMESTAMP NULL,
        last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (ip_address)
    )");
    echo "<p>✅ 'ip_rate_limits' table check passed.</p>";

    echo "<h2>🎉 Security Upgrade Complete!</h2>";
    echo "<p>You can now use the advanced login page.</p>";

} catch (PDOException $e) {
    echo "<h2 style='color:red'>❌ Error: " . $e->getMessage() . "</h2>";
}
?>