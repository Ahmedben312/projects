<?php
/**
 * Simple Database Setup Script
 * This script doesn't rely on DatabaseManager
 */

echo "<!DOCTYPE html>
<html>
<head>
    <title>Setup Database - E-Commerce Shop</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .step { margin: 15px 0; padding: 10px; border-left: 4px solid #3498db; }
        .btn { background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .warning { background: #fff3cd; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Database Setup - E-Commerce Shop</h1>";

try {
    echo "<div class='step'>Step 1: Testing database connection...</div>";
    
    // Test connection to MySQL server (without database)
    $pdo = new PDO("mysql:host=localhost", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<div class='success'>✓ Connected to MySQL server</div>";
    
    echo "<div class='step'>Step 2: Creating database...</div>";
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ecommerce_shop");
    echo "<div class='success'>✓ Database 'ecommerce_shop' created</div>";
    
    // Use the database
    $pdo->exec("USE ecommerce_shop");
    
    echo "<div class='step'>Step 3: Creating tables and sample data...</div>";
    
    // Read and execute SQL file
    $sql_file = __DIR__ . '/sql/full_setup.sql';
    if (file_exists($sql_file)) {
        $sql = file_get_contents($sql_file);
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        $tables_created = 0;
        $data_inserted = 0;
        
        foreach ($statements as $statement) {
            if (!empty($statement) && !preg_match('/^--/', $statement)) {
                try {
                    $pdo->exec($statement);
                    
                    // Count what we're doing
                    if (stripos($statement, 'CREATE TABLE') !== false) {
                        $tables_created++;
                    } elseif (stripos($statement, 'INSERT INTO') !== false) {
                        $data_inserted++;
                    }
                    
                } catch (PDOException $e) {
                    // Ignore "table already exists" and "duplicate entry" errors
                    if (strpos($e->getMessage(), 'already exists') === false && 
                        strpos($e->getMessage(), 'Duplicate entry') === false) {
                        throw $e;
                    }
                }
            }
        }
        
        echo "<div class='success'>✓ Tables created: $tables_created</div>";
        echo "<div class='success'>✓ Data records inserted: $data_inserted</div>";
        
        // Verify setup
        echo "<div class='step'>Step 4: Verifying setup...</div>";
        
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $products = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        $categories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        
        echo "<div class='success'>✓ Found " . count($tables) . " tables</div>";
        echo "<div class='success'>✓ $categories categories with $products products</div>";
        
        echo "<h2 style='color: green;'>🎉 Database Setup Complete!</h2>";
        echo "<p><a href='public/index.php' class='btn'>Go to Your Store</a></p>";
        
    } else {
        echo "<div class='error'>SQL file not found: $sql_file</div>";
        echo "<div class='warning'>";
        echo "<p>Please create the file <code>sql/full_setup.sql</code> with your database schema.</p>";
        echo "<p>You can use phpMyAdmin to create the database manually.</p>";
        echo "</div>";
    }
    
} catch (PDOException $e) {
    echo "<div class='error'>Setup failed: " . $e->getMessage() . "</div>";
    echo "<div class='warning'>";
    echo "<p>Make sure:</p>";
    echo "<ul>";
    echo "<li>MySQL is running in XAMPP Control Panel</li>";
    echo "<li>MySQL username and password are correct</li>";
    echo "<li>You have permission to create databases</li>";
    echo "</ul>";
    echo "<p>Alternative: Use phpMyAdmin to create the database manually.</p>";
    echo "</div>";
}

echo "</body></html>";
?>