<?php
// public/api/setup/admin/auto_fix_collation.php

require_once '../../config/db.php';

header('Content-Type: text/plain');
echo "=== 🔧 AUTO-MATCH DATABASE COLLATION ===\n\n";

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. GET THE 'USERS' TABLE COLLATION (The Source of Truth)
    // We look up the exact setting used by the 'users' table
    $stmt = $conn->query("
        SELECT table_collation
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        AND table_name = 'users'
        LIMIT 1
    ");
    $targetCollation = $stmt->fetchColumn();

    if (!$targetCollation) {
        die("❌ ERROR: Could not read 'users' table settings. Does the table exist?");
    }

    echo "🎯 TARGET COLLATION DETECTED: [$targetCollation]\n";
    echo "   (We will make all other tables match this setting)\n\n";

    // 2. LIST OF TABLES TO FIX
    $tablesToFix = [
        'inbox_showcase',
        'inbox_lens',
        'master_showcase',
        'master_lens',
        'showcase_gallery',
        'lens_gallery'
    ];

    // 3. APPLY THE FIX
    foreach ($tablesToFix as $table) {
        // We extract the character set from the collation (e.g., utf8mb4 from utf8mb4_unicode_ci)
        $charset = explode('_', $targetCollation)[0];

        $sql = "ALTER TABLE $table CONVERT TO CHARACTER SET $charset COLLATE $targetCollation";
        $conn->exec($sql);
        echo "✅ Fixed table: $table\n";
    }

    echo "\nSUCCESS: All tables are now aligned to '$targetCollation'.\n";
    echo "👉 You can now run the Cron Job (process_inbox.php) again.";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>