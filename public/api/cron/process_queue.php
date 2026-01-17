<?php
// public/api/cron/process_hackathon_queue.php

// 1. Setup
header('Content-Type: application/json');
require_once '../../config/db.php';

// Prevent timeout for long batches
set_time_limit(300);

echo "<h2>⚙️ Processing Registration Queue...</h2>";

try {
    // 2. Fetch Pending Items (Limit 50 at a time for safety)
    $sql = "SELECT * FROM hackathon_registrations_queue WHERE status = 'pending' ORDER BY created_at ASC LIMIT 50";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $queueItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($queueItems) === 0) {
        echo "✅ Queue is empty. No actions needed.";
        exit;
    }

    $processed = 0;
    $errors = 0;

    foreach ($queueItems as $item) {
        $qId = $item['id'];
        $userId = $item['user_id'];
        $hackathonId = $item['hackathon_id'];
        $payload = json_decode($item['payload_json'], true);
        $type = $payload['type']; // 'solo', 'create_team', 'join_team'

        try {
            $conn->beginTransaction();

            // --- LOGIC SWITCH ---

            if ($type === 'solo') {
                // CASE 1: SOLO REGISTRATION
                $insert = $conn->prepare("INSERT INTO hackathon_participants (user_id, hackathon_id, role, status) VALUES (?, ?, 'solo', 'approved')");
                $insert->execute([$userId, $hackathonId]);

            } elseif ($type === 'create_team') {
                // CASE 2: CREATE TEAM
                // Generate Unique 6-Digit Code
                $teamCode = strtoupper(substr(md5(uniqid()), 0, 6));
                $teamName = $payload['team_name'];

                // Create Team
                $createTeam = $conn->prepare("INSERT INTO hackathon_teams (hackathon_id, team_name, team_code, leader_user_id, members_count) VALUES (?, ?, ?, ?, 1)");
                $createTeam->execute([$hackathonId, $teamName, $teamCode, $userId]);
                $teamId = $conn->lastInsertId();

                // Add Leader to Participants
                $insert = $conn->prepare("INSERT INTO hackathon_participants (user_id, hackathon_id, team_id, role, status) VALUES (?, ?, ?, 'leader', 'approved')");
                $insert->execute([$userId, $hackathonId, $teamId]);

            } elseif ($type === 'join_team') {
                // CASE 3: JOIN TEAM
                $code = $payload['team_code'];

                // Find Team
                $findTeam = $conn->prepare("SELECT id, members_count FROM hackathon_teams WHERE team_code = ? AND hackathon_id = ? FOR UPDATE");
                $findTeam->execute([$code, $hackathonId]);
                $team = $findTeam->fetch(PDO::FETCH_ASSOC);

                if (!$team) throw new Exception("Invalid Team Code");

                // Check Max Size (Hardcoded to 5 for now, or fetch from hackathon config)
                if ($team['members_count'] >= 5) throw new Exception("Team is full");

                // Update Count
                $updateCount = $conn->prepare("UPDATE hackathon_teams SET members_count = members_count + 1 WHERE id = ?");
                $updateCount->execute([$team['id']]);

                // Add Member
                $insert = $conn->prepare("INSERT INTO hackathon_participants (user_id, hackathon_id, team_id, role, status) VALUES (?, ?, ?, 'member', 'approved')");
                $insert->execute([$userId, $hackathonId, $team['id']]);
            }

            // --- MARK COMPLETE ---
            $conn->commit();

            $markDone = $conn->prepare("UPDATE hackathon_registrations_queue SET status = 'completed' WHERE id = ?");
            $markDone->execute([$qId]);
            $processed++;

        } catch (Exception $e) {
            $conn->rollBack();
            // Log Error in Queue Table
            $markFail = $conn->prepare("UPDATE hackathon_registrations_queue SET status = 'failed', error_log = ? WHERE id = ?");
            $markFail->execute([$e->getMessage(), $qId]);
            $errors++;
        }
    }

    echo "<h3>Job Done!</h3>";
    echo "✅ Processed: $processed<br>";
    echo "❌ Failed: $errors<br>";

} catch (PDOException $e) {
    echo "CRITICAL ERROR: " . $e->getMessage();
}
?>