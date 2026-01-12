<?php
// public/api/admin/auth/forgot_password.php
require_once '../../config/db.php';

// Allow CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["status" => "error", "message" => "Method not allowed"]));
}

$data = json_decode(file_get_contents("php://input"));
$email = trim($data->email ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "Invalid email format"]));
}

try {
    // 1. Check if admin exists
    $stmt = $conn->prepare("SELECT admin_id FROM admins WHERE email = :email AND status = 'active'");
    $stmt->execute([':email' => $email]);

    if ($stmt->rowCount() > 0) {
        // 2. Generate Token
        $token = bin2hex(random_bytes(32));
        $token_hash = hash('sha256', $token);
        $expiry = date("Y-m-d H:i:s", strtotime("+30 minutes"));

        // 3. Save to DB
        $update = $conn->prepare("UPDATE admins SET reset_token_hash = :hash, reset_token_expires_at = :expiry WHERE email = :email");
        $update->execute([
            ':hash' => $token_hash,
            ':expiry' => $expiry,
            ':email' => $email
        ]);

        // 4. Send Email (Uncommented & Configured for Hostinger)
        $resetLink = "https://bharatxr.edtech-community.com/bharatxrpannelpanneladmin/reset?token=$token&email=" . urlencode($email);

        $subject = "Reset Your Admin Password";
        $message = "Hello,\n\nClick here to reset your password:\n$resetLink\n\nThis link expires in 30 minutes.";

        // IMPORTANT: The 'From' email MUST exist on your Hostinger panel to avoid spam filters
        $headers = "From: no-reply@edtech-community.com\r\n";
        $headers .= "Reply-To: no-reply@edtech-community.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Try to send mail
        $mailSent = mail($email, $subject, $message, $headers);

        echo json_encode([
            "status" => "success",
            "message" => $mailSent ? "Reset link sent to your email." : "Could not send email (Server Error).",
            // KEEPING DEBUG LINK so you can test even if email fails
            "debug_link" => $resetLink
        ]);
    } else {
        echo json_encode(["status" => "success", "message" => "If the email exists, a reset link has been sent."]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>