<?php
require_once __DIR__ . '/includes/config.php';

echo "<h1>Final System Test</h1>";

// Test 1: Basic PHP
echo "<p>PHP Version: " . phpversion() . "</p>";

// Test 2: Database connection
try {
    $pdo_test = new PDO("mysql:host=localhost;dbname=ecommerce_shop", "root", "");
    echo "<p style='color: green;'>✓ Database connected successfully</p>";
    
    $tables = $pdo_test->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tables in database: " . count($tables) . "</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>✗ Database error: " . $e->getMessage() . "</p>";
}

// Test 3: DatabaseManager
if ($dbManager instanceof DatabaseManager) {
    echo "<p style='color: green;'>✓ DatabaseManager loaded successfully</p>";
    
    $status = $dbManager->getDatabaseStatus();
    echo "<p>Database status: " . $status['tables'] . " tables</p>";
    
} else {
    echo "<p style='color: orange;'>⚠ DatabaseManager not available (this is OK for basic operation)</p>";
}

// Test 4: File structure
$essential_files = [
    'includes/config.php',
    'includes/functions.php', 
    'includes/header.php',
    'includes/footer.php',
    'public/index.php',
    'sql/full_setup.sql'
];

echo "<h3>Essential Files:</h3>";
foreach ($essential_files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "<p style='color: green;'>✓ $file</p>";
    } else {
        echo "<p style='color: red;'>✗ $file (missing)</p>";
    }
}

echo "<h2>Next Steps:</h2>";
echo "<ul>";
echo "<li><a href='check_database.php'>Check Database Status</a></li>";
echo "<li><a href='setup_database.php'>Setup Database</a> (if needed)</li>";
echo "<li><a href='public/index.php'>Go to Store</a></li>";
echo "</ul>";
?>