<?php
class DatabaseManager {
    private $pdo;
    private $sqlPath;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->sqlPath = dirname(__DIR__) . '/sql';
    }
    
    /**
     * Check if database is set up
     */
    public function isDatabaseSetUp(): bool {
        try {
            $tables = ['users', 'products', 'categories', 'orders'];
            foreach ($tables as $table) {
                $this->pdo->query("SELECT 1 FROM $table LIMIT 1");
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * Get database status
     */
    public function getDatabaseStatus(): array {
        $status = ['tables' => 0];
        
        try {
            $tables = $this->pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            $status['tables'] = count($tables);
            
            $tableCounts = ['users', 'products', 'categories', 'orders'];
            foreach ($tableCounts as $table) {
                if (in_array($table, $tables)) {
                    $count = $this->pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                    $status[$table] = (int)$count;
                } else {
                    $status[$table] = 'Not found';
                }
            }
            
        } catch (Exception $e) {
            $status['error'] = $e->getMessage();
        }
        
        return $status;
    }
    
    /**
     * Execute SQL from file
     */
    public function executeSQLFile(string $filePath): bool {
        if (!file_exists($filePath)) {
            throw new Exception("SQL file not found: $filePath");
        }
        
        $sql = file_get_contents($filePath);
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        foreach ($statements as $statement) {
            if (!empty($statement) && !preg_match('/^--/', $statement)) {
                try {
                    $this->pdo->exec($statement);
                } catch (PDOException $e) {
                    // Ignore "table already exists" errors during setup
                    if (strpos($e->getMessage(), 'already exists') === false) {
                        throw $e;
                    }
                }
            }
        }
        
        return true;
    }
    
    /**
     * Setup database from SQL files
     */
    public function setupDatabase(): bool {
        try {
            // Create database if it doesn't exist
            $this->pdo->exec("CREATE DATABASE IF NOT EXISTS ecommerce_shop");
            $this->pdo->exec("USE ecommerce_shop");
            
            // If full_setup.sql exists, use that
            $fullSetupFile = $this->sqlPath . '/full_setup.sql';
            if (file_exists($fullSetupFile)) {
                $this->executeSQLFile($fullSetupFile);
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            throw new Exception("Database setup failed: " . $e->getMessage());
        }
    }
    
    /**
     * Get list of SQL files for documentation
     */
    public function getSQLFiles(): array {
        $files = [];
        $categories = ['schema', 'data'];
        
        foreach ($categories as $category) {
            $categoryPath = $this->sqlPath . '/' . $category;
            if (is_dir($categoryPath)) {
                $categoryFiles = scandir($categoryPath);
                foreach ($categoryFiles as $file) {
                    if (pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                        $files[$category][] = $file;
                    }
                }
                if (isset($files[$category])) {
                    sort($files[$category]);
                }
            }
        }
        
        return $files;
    }
}
?>