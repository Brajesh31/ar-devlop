<?php
// public/api/setup/check_status.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config/db.php';

echo "<h1>📊 Database Status Report</h1>";

try {
    // 1. List All Tables & Row Counts
    echo "<h3>1. Current Tables</h3>";
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    if (empty($tables)) {
        echo "<p style='color:red'>❌ No tables found! Database is empty.</p>";
    } else {
        echo "<table border='1' cellpadding='5' style='border-collapse:collapse;'>
        <tr style='background:#eee'><th>Table Name</th><th>Rows</th><th>Status</th></tr>";

        foreach ($tables as $table) {
            $count = $conn->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            echo "<tr><td><b>$table</b></td><td>$count</td><td>✅ Active</td></tr>";
        }
        echo "</table>";
    }

    // 2. Check 'users' Columns
    echo "<h3>2. Checking 'users' Table Schema</h3>";
    if (in_array('users', $tables)) {
        $columns = $conn->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);

        $required = ['first_name', 'middle_name', 'last_name', 'email', 'phone', 'linkedin_url', 'github_url', 'user_type'];

        echo "<ul>";
        foreach ($required as $col) {
            if (in_array($col, $columns)) {
                echo "<li style='color:green'>✅ <b>$col</b> exists</li>";
            } else {
                echo "<li style='color:red'>❌ <b>$col</b> is MISSING!</li>";
            }
        }
        echo "</ul>";
    } else {
        echo "<p style='color:red'>❌ 'users' table is missing!</p>";
    }

} catch (PDOException $e) {
    echo "<h2>❌ Error: " . $e->getMessage() . "</h2>";
}
?>