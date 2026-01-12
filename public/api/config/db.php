<?php
// public/api/config/db.php

// 1. Set Timezone to IST (India Standard Time)
date_default_timezone_set('Asia/Kolkata');

// 2. Secure Session Settings
// valid for 30 minutes (1800 seconds)
ini_set('session.gc_maxlifetime', 1800);
session_set_cookie_params([
    'lifetime' => 0, // 0 = Expire when browser closes ("Exit website")
    'path' => '/',
    'domain' => '', // Set to your domain in production
    'secure' => true, // Only send over HTTPS
    'httponly' => true, // JavaScript cannot access cookies (XSS Protection)
    'samesite' => 'Strict'
]);

// 3. CORS Headers
$allowed_origins = [
    "http://localhost:8082",
    "https://bharatxr.edtech-community.com"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

header("Content-Type: application/json; charset=UTF-8");

// 4. Database Connection
$host = "localhost";
$db_name = "u288920822_BHARATXR";
$username = "u288920822_BHARATXRSQL";
$password = "bK@31012004";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Force DB to use IST offset
    $conn->exec("SET time_zone = '+05:30';");
} catch(PDOException $exception) {
    http_response_code(503);
    echo json_encode(["status" => "error", "message" => "Database Connection Error."]);
    exit();
}
?>