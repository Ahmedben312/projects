<?php
require_once __DIR__ . '/includes/config.php';

echo "<h2>Database Status Check</h2>";

// Check if DatabaseManager is available
if ($dbManager === null) {
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>";
    echo "<p>DatabaseManager is not available. Using direct database connection.</p>";
    echo "</div>";
    
    // Use direct database check
    try {
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "<p style='color: green;'>✓ Database connected successfully</p>";
        echo "<p>Tables found: " . count($tables) . "</p>";
        
        if (count($tables) > 0) {
            echo "<ul>";
            foreach ($tables as $table) {
                $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                echo "<li>$table ($count records)</li>";
            }
            echo "</ul>";
            
            echo "<p style='color: green;'>✅ Database is properly set up!</p>";
            echo "<p><a href='public/index.php'>Go to Store</a></p>";
        } else {
            echo "<p style='color: orange;'>⚠ Database exists but has no tables</p>";
            echo "<p><a href='setup_database.php'>Run Database Setup</a></p>";
        }
        
    } catch (PDOException $e) {
        echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    }
    
} else {
    // Use DatabaseManager
    $status = $dbManager->getDatabaseStatus();

    if (isset($status['error'])) {
        echo "<p style='color: red;'>Error: " . $status['error'] . "</p>";
    } else {
        echo "<p style='color: green;'>✓ Database connected successfully</p>";
        echo "<p>Tables found: " . $status['tables'] . "</p>";
        echo "<ul>";
        echo "<li>Users: " . $status['users'] . "</li>";
        echo "<li>Products: " . $status['products'] . "</li>";
        echo "<li>Categories: " . $status['categories'] . "</li>";
        echo "<li>Orders: " . $status['orders'] . "</li>";
        echo "</ul>";
        
        if ($status['products'] > 0) {
            echo "<p style='color: green;'>✅ Database is properly set up!</p>";
            echo "<p><a href='public/index.php'>Go to Store</a></p>";
        } else {
            echo "<p style='color: orange;'>⚠ Database exists but may need sample data</p>";
            echo "<p><a href='setup_database.php'>Run Setup</a></p>";
        }
    }

    // Show available SQL files if DatabaseManager has the method
    if (method_exists($dbManager, 'getSQLFiles')) {
        $sqlFiles = $dbManager->getSQLFiles();
        echo "<h3>Available SQL Files:</h3>";
        foreach ($sqlFiles as $category => $files) {
            echo "<h4>" . ucfirst($category) . ":</h4><ul>";
            foreach ($files as $file) {
                echo "<li><a href='sql/$category/$file' target='_blank'>$file</a></li>";
            }
            echo "</ul>";
        }
    }
}

// Always show basic SQL files
echo "<h3>Core SQL Files:</h3>";
echo "<ul>";
if (file_exists(SQL_PATH . '/full_setup.sql')) {
    echo "<li><a href='sql/full_setup.sql' target='_blank'>full_setup.sql</a> - Complete database setup</li>";
}
if (file_exists(SQL_PATH . '/schema/01_tables.sql')) {
    echo "<li><a href='sql/schema/01_tables.sql' target='_blank'>01_tables.sql</a> - Table structure</li>";
}
echo "</ul>";
?>