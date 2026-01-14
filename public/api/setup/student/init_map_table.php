<?php
// public/api/setup/student/init_map_table.php

header('Content-Type: application/json');

// 1. Load Database Config
// Adjust path to match your folder structure: public/api/setup/student/ -> public/api/config/
require_once '../../config/db.php';

try {
    // 2. SQL to Create the Master Map Table
    // We use constraints to create visible relationships in phpMyAdmin Designer
    $sql = "CREATE TABLE IF NOT EXISTS `user_event_map` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

        `user_id` INT(11) NOT NULL,
        `event_id` INT(11) NOT NULL,

        `registration_table` VARCHAR(255) NOT NULL,
        `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (`id`),

        -- 🚀 PERFORMANCE INDEXES
        -- These make the Student Dashboard load instantly
        INDEX `idx_user_fast_lookup` (`user_id`),
        INDEX `idx_event_lookup` (`event_id`),

        -- 🛡️ DUPLICATE PROTECTION
        -- Prevents a student from registering for the same event ID twice
        UNIQUE KEY `unique_user_event` (`user_id`, `event_id`),

        -- 🔗 VISIBLE RELATIONS (Foreign Keys)
        -- These lines tell the database: 'This user_id MUST exist in the users table'
        CONSTRAINT `fk_map_user`
            FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

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