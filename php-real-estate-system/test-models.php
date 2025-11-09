<?php
require_once 'config/config.php';

echo "<h2>Testing Model Loading</h2>";

// Test if models can be instantiated
try {
    $user = new User($db);
    echo "✅ User model loaded successfully<br>";
    
    $property = new Property($db);
    echo "✅ Property model loaded successfully<br>";
    
    $favorite = new Favorite($db);
    echo "✅ Favorite model loaded successfully<br>";
    
    // Test database connection
    $testProperties = $property->getFeatured(2);
    echo "✅ Database query successful<br>";
    echo "✅ Found " . count($testProperties) . " properties<br>";
    
} catch (Error $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "<br>";
}