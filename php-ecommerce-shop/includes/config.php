<?php
session_start();

// Define root paths
define('ROOT_PATH', dirname(__DIR__));
define('PUBLIC_PATH', ROOT_PATH . '/public');
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('SQL_PATH', ROOT_PATH . '/sql');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ecommerce_shop');

// Site configuration
define('SITE_URL', 'http://localhost/php-ecommerce-shop');
define('SITE_NAME', 'ShopHub');
define('ASSETS_PATH', SITE_URL . '/public/assets');

// Database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
} catch(PDOException $e) {
    // Show helpful error message without requiring DatabaseManager
    $error_message = $e->getMessage();
    
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Database Error - " . SITE_NAME . "</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; }
            .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; }
            .solution { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>Database Connection Error</h1>
            <div class='error'>
                <strong>Error:</strong> " . $error_message . "
            </div>
            
            <div class='solution'>
                <h3>Quick Solutions:</h3>
                <p><strong>Option 1:</strong> <a href='http://localhost/phpmyadmin' class='btn' target='_blank'>Create Database via phpMyAdmin</a></p>
                <p>Create database named: <code>ecommerce_shop</code></p>
                
                <p><strong>Option 2:</strong> <a href='setup_database.php' class='btn'>Auto-setup Database</a></p>
                <p>This will create the database and tables automatically.</p>
            </div>
        </div>
    </body>
    </html>";
    exit;
}

// Initialize DatabaseManager if the file exists
$dbManager = null;
if (file_exists(INCLUDES_PATH . '/DatabaseManager.php')) {
    require_once INCLUDES_PATH . '/DatabaseManager.php';
    $dbManager = new DatabaseManager($pdo);
}

// Include helper functions
require_once INCLUDES_PATH . '/functions.php';
?>