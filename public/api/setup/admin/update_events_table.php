<?php
// public/api/setup/admin/update_events_table.php
// RUN THIS FILE ONCE TO PATCH YOUR EVENTS TABLE

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

echo "<h2>🛠️ Updating Events Table Structure...</h2>";

try {
    // 1. Add 'registration_table_name'
    // This stores the name of the dynamic table (e.g., event_15_hackathon)
    $conn->exec("ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_table_name VARCHAR(255) AFTER slug");
    echo "✅ Column <code>registration_table_name</code> check/added.<br>";

    // 2. Add 'venue_name'
    $conn->exec("ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255) AFTER mode");
    echo "✅ Column <code>venue_name</code> check/added.<br>";

    // 3. Add 'banner_image_url'
    $conn->exec("ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_image_url VARCHAR(255) AFTER venue_name");
    echo "✅ Column <code>banner_image_url</code> check/added.<br>";

    echo "<hr><h3 style='color:green'>🎉 Database Patch Complete!</h3>";
    echo "Your events table is now ready for Dynamic Table creation.";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>