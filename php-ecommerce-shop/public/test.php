<?php
// Simple test without complex dependencies
echo "<h1>Simple Test Page</h1>";
echo "<p>If you see this, PHP is working!</p>";

// Test database connection
try {
    $pdo = new PDO("mysql:host=localhost;dbname=ecommerce_shop", "root", "");
    echo "<p style='color: green;'>✓ Database connected successfully</p>";
    
    // Check tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<p style='color: green;'>✓ Found " . count($tables) . " tables in database</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>✗ Database error: " . $e->getMessage() . "</p>";
}

// Test file structure
echo "<h2>File Structure Test:</h2>";
$files = [
    'Config' => file_exists(__DIR__ . '/../includes/config.php'),
    'Header' => file_exists(__DIR__ . '/../includes/header.php'),
    'CSS' => file_exists(__DIR__ . '/assets/css/style.css')
];

foreach ($files as $name => $exists) {
    $color = $exists ? 'green' : 'red';
    $mark = $exists ? '✓' : '✗';
    echo "<p style='color: $color;'>$mark $name file " . ($exists ? 'exists' : 'missing') . "</p>";
}

echo "<h2>Next Steps:</h2>";
echo "<p><a href='index.php'>Try the main index page</a></p>";
?>