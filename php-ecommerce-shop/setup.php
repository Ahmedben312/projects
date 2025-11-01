<?php
/**
 * Database Setup Script
 * Run this once to create the database and tables
 */

echo "<h2>E-Commerce Shop Setup</h2>";

// Database configuration
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'ecommerce_shop';

try {
    // Connect to MySQL without selecting database
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    $pdo->exec("USE `$dbname`");
    
    echo "✓ Database created successfully<br>";
    
    // Read and execute SQL file
    $sql_file = __DIR__ . '/sql/database.sql';
    if (file_exists($sql_file)) {
        $sql = file_get_contents($sql_file);
        
        // Split SQL statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $pdo->exec($statement);
            }
        }
        
        echo "✓ Tables created successfully<br>";
        echo "✓ Sample data inserted<br>";
        echo "<br><strong>Setup completed successfully!</strong><br>";
        echo "<a href='public/index.php'>Go to Website</a>";
    } else {
        echo "❌ SQL file not found: $sql_file";
    }
    
} catch(PDOException $e) {
    echo "<pre>";
    echo "❌ Setup failed: " . $e->getMessage() . "\n\n";
    echo "Troubleshooting:\n";
    echo "1. Make sure MySQL server is running\n";
    echo "2. Check your database credentials in setup.php\n";
    echo "3. On MAMP, try using port 8889: localhost:8889\n";
    echo "4. On XAMPP, the password might be empty\n";
    echo "</pre>";
}
?>