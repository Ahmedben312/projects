<?php
// Helper functions
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getUserId() {
    return $_SESSION['user_id'] ?? null;
}

function getSessionId() {
    if (!isset($_SESSION['cart_session_id'])) {
        $_SESSION['cart_session_id'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['cart_session_id'];
}

function redirect($url) {
    header("Location: " . SITE_URL . $url);
    exit;
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function sendEmail($to, $subject, $message) {
    $headers = "From: " . FROM_EMAIL . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    return mail($to, $subject, $message, $headers);
}

function getCartCount() {
    global $pdo;
    
    if (isLoggedIn()) {
        $stmt = $pdo->prepare("SELECT SUM(quantity) FROM cart WHERE user_id = ?");
        $stmt->execute([getUserId()]);
    } else {
        $stmt = $pdo->prepare("SELECT SUM(quantity) FROM cart WHERE session_id = ?");
        $stmt->execute([getSessionId()]);
    }
    
    return $stmt->fetchColumn() ?? 0;
}

function formatPrice($price) {
    return '$' . number_format($price, 2);
}

function getProductStock($product_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT stock_quantity FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    return $stmt->fetchColumn();
}
?>