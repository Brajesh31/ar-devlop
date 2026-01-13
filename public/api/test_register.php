<?php
// public/api/test_register.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// FIX: Correct path to db.php from public/api/
$dbPath = __DIR__ . '/config/db.php';

if (file_exists($dbPath)) {
    require_once $dbPath;
} else {
    die("❌ Critical Error: Could not find db.php at: $dbPath");
}

// Simulate a Student Registration
$data = [
    'first_name' => 'Test',
    'last_name'  => 'User',
    'email'      => 'test' . rand(100,999) . '@example.com',
    'phone'      => '99999' . rand(10000,99999),
    'password'   => 'password123',
    'user_type'  => 'undergraduate',
    'linkedin_url' => 'https://linkedin.com/in/test',
    'github_url'   => 'https://github.com/test',
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
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);

echo "<h1>Registration Test Result:</h1>";

if(curl_errno($ch)){
    echo '<h3 style="color:red">Curl Error: ' . curl_error($ch) . '</h3>';
} else {
    // Check HTTP Code
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode !== 200) {
        echo "<h3 style='color:red'>HTTP Error Code: $httpCode</h3>";
    }
}

curl_close($ch);

echo "<pre>" . htmlspecialchars($response) . "</pre>";
?>