<?php
// public/api/setup/student/update_schema_counts.php

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h1>Updating Directory Tables...</h1>";

try {
    $conn->beginTransaction();

    // 1. Update School Directory
    $conn->exec("ALTER TABLE directory_schools ADD COLUMN student_count INT DEFAULT 0 AFTER dynamic_table_name");
    echo "<p>✅ Added 'student_count' to directory_schools</p>";

    // 2. Update Undergraduate Directory
    $conn->exec("ALTER TABLE directory_colleges_ug ADD COLUMN student_count INT DEFAULT 0 AFTER dynamic_table_name");
    echo "<p>✅ Added 'student_count' to directory_colleges_ug</p>";

    // 3. Update Graduate Directory
    $conn->exec("ALTER TABLE directory_colleges_pg ADD COLUMN student_count INT DEFAULT 0 AFTER dynamic_table_name");
    echo "<p>✅ Added 'student_count' to directory_colleges_pg</p>";

    $conn->commit();
    echo "<h2>🎉 Schema Update Complete!</h2>";

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    // Ignore "Duplicate column name" errors if you run it twice
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "<h2>⚠️ Columns already exist. No changes made.</h2>";
    } else {
        echo "<h2 style='color:red'>❌ Error: " . $e->getMessage() . "</h2>";
    }
}
?>