<?php
// public/api/setup/student/init_map_table.php

header('Content-Type: application/json');

// 1. Load Database Config
require_once '../../config/db.php';

try {
    // Enable error reporting for detailed SQL errors
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. SQL to Create the Master Map Table
    $sql = "CREATE TABLE IF NOT EXISTS `user_event_map` (
        `id` BIGINT NOT NULL AUTO_INCREMENT,

        -- ✅ FIXED: Removed 'UNSIGNED' to match your 'users' and 'events' tables
        `user_id` INT NOT NULL,
        `event_id` INT NOT NULL,

        `registration_table` VARCHAR(255) NOT NULL,
        `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (`id`),

        -- 🚀 PERFORMANCE INDEXES
        INDEX `idx_user_fast_lookup` (`user_id`),
        INDEX `idx_event_lookup` (`event_id`),

        -- 🛡️ DUPLICATE PROTECTION
        UNIQUE KEY `unique_user_event` (`user_id`, `event_id`),

        -- 🔗 VISIBLE RELATIONS (Foreign Keys)
        -- ✅ FIXED: referencing 'user_id' instead of 'id'
        CONSTRAINT `fk_map_user`
            FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

        -- ✅ FIXED: removed UNSIGNED to match parent table
        CONSTRAINT `fk_map_event`
            FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sql);

    echo json_encode([
        'status' => 'success',
        'message' => 'Table user_event_map created successfully.',
        'relations' => 'Foreign Keys established. You can now view connections in phpMyAdmin Designer.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Setup Failed: ' . $e->getMessage()
    ]);
}
?>