<?php
// public/api/setup/admin/patch_full_event_schema.php
// RUN THIS ONCE to align your DB with the specific frontend requirements

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../../config/db.php';

echo "<h2>🛠️ Patching Event Schema for Full Detail Support...</h2>";

try {
    // 1. Add Image Path (for file deletion logic)
    $conn->exec("ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_path VARCHAR(255) AFTER banner_image_url");

    // 2. Add Missing Fields from your 'events.ts' interface
    $columns = [
        // Basic Info
        "subtitle" => "VARCHAR(255) AFTER title",
        "long_description" => "TEXT AFTER description",
        "event_type" => "ENUM('workshop', 'hackathon', 'challenge', 'meetup') DEFAULT 'workshop' AFTER slug",

        // Logistics
        "fee_type" => "ENUM('free', 'paid') DEFAULT 'free' AFTER mode",
        "price" => "DECIMAL(10, 2) DEFAULT 0.00 AFTER fee_type",
        "team_size" => "VARCHAR(50) AFTER price", // e.g. "2-4 members"
        "registration_deadline" => "DATETIME AFTER end_date",
        "venue_name" => "VARCHAR(255) AFTER mode", // Ensure this exists
        "location_city" => "VARCHAR(100) AFTER venue_name", // e.g. "New Delhi"

        // Complex Data (Stored as JSON)
        "tags" => "JSON NULL",
        "eligibility" => "JSON NULL", // { age, region, openFor }
        "rewards" => "JSON NULL", // Array of objects
        "timeline" => "JSON NULL", // Array of timeline items
        "faqs" => "JSON NULL", // Array of Q&A
        "participation_steps" => "JSON NULL", // Array of strings
        "highlights" => "JSON NULL", // { date, location, format }
        "participant_types" => "JSON NULL", // Array of { title, description }

        // Legal
        "terms_conditions" => "TEXT NULL"
    ];

    foreach ($columns as $col => $def) {
        $conn->exec("ALTER TABLE events ADD COLUMN IF NOT EXISTS $col $def");
        echo "✅ Checked/Added column: <code>$col</code><br>";
    }

    // 3. Create Upload Directory
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/events/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
        echo "✅ Created directory: <code>uploads/events/</code><br>";
    }

    echo "<hr><h3 style='color:green'>🎉 Database Schema Updated!</h3>";

} catch(PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3> " . $e->getMessage();
}
?>