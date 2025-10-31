<?php
function requireLogin() {
    if (!isLoggedIn()) {
        $_SESSION['redirect_url'] = $_SERVER['REQUEST_URI'];
        header('Location: login.php');
        exit();
    }
}

function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        header('HTTP/1.0 403 Forbidden');
        echo 'Access denied. Admin privileges required.';
        exit();
    }
}

function requireAuthor() {
    requireLogin();
    if (!isAuthor()) {
        header('HTTP/1.0 403 Forbidden');
        echo 'Access denied. Author privileges required.';
        exit();
    }
}
?>