<?php
// public/api/setup/admin/setup_events_v2.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../../config/db.php';

echo "<h2>⚙️ Setting up Advanced Event System...</h2>";

try {
    // 1. Create Folder
    $path = $_SERVER['DOCUMENT_ROOT'] . '/uploads/events/';
    if (!file_exists($path)) {
        mkdir($path, 0777, true);
        echo "✅ Created folder: uploads/events/<br>";
    }

    // 2. Update Events Table Structure
    $sql = "ALTER TABLE events
            ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255) AFTER title,
            ADD COLUMN IF NOT EXISTS long_description TEXT AFTER description,
            ADD COLUMN IF NOT EXISTS banner_image_url VARCHAR(255),
            ADD COLUMN IF NOT EXISTS registration_table_name VARCHAR(100),

            -- JSON Fields for complex data
            ADD COLUMN IF NOT EXISTS tags JSON,
            ADD COLUMN IF NOT EXISTS rewards JSON,
            ADD COLUMN IF NOT EXISTS timeline JSON,
            ADD COLUMN IF NOT EXISTS faqs JSON,
            ADD COLUMN IF NOT EXISTS eligibility JSON,
            ADD COLUMN IF NOT EXISTS fee_type ENUM('free','paid') DEFAULT 'free',
            ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS location_city VARCHAR(100),
            ADD COLUMN IF NOT EXISTS team_size VARCHAR(50),
            ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00
            ";

    $conn->exec($sql);
    echo "✅ Database Table 'events' Updated Successfully.<br>";
    echo "<h3 style='color:green'>🚀 Ready to go!</h3>";

} catch (PDOException $e) {
    echo "<h3 style='color:red'>Error: " . $e->getMessage() . "</h3>";
}
?>