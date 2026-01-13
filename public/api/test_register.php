<?php
// public/api/test_register.php
ini_set('display_errors', 1);
if (file_exists('../config/db.php')) {
    require_once '../config/db.php';
} elseif (file_exists('../../config/db.php')) {
    require_once '../../config/db.php';
} else {
    die("❌ Critical Error: Could not find db.php. Please check if 'api/config/db.php' exists.");
}

// Simulate a Student Registration
$data = [
    'first_name' => 'Test',
    'last_name'  => 'User',
    'email'      => 'test' . rand(100,999) . '@example.com', // Random email to avoid duplicate error
    'phone'      => '99999' . rand(10000,99999),
    'password'   => 'password123',
    'user_type'  => 'undergraduate',
    'linkedin_url' => 'https://linkedin.com/in/test',
    'github_url'   => 'https://github.com/test',
    // College Details
    'college_name' => 'IIT Test College',
    'branch'       => 'CSE',
    'stream'       => 'B.Tech'
];

// Send Request to your own Register API
$url = "https://bharatxr.edtech-community.com/api/auth/register.php";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

echo "<h1>Registration Test Result:</h1>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";
?>