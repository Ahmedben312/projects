<?php
require_once __DIR__ . '/../includes/config.php';

$page_title = "Home";
require_once INCLUDES_PATH . '/header.php';
?>

<h1>Welcome to <?php echo SITE_NAME; ?></h1>
<p>Your e-commerce store is working!</p>

<?php
// Simple products display
try {
    $stmt = $pdo->query("SELECT * FROM products LIMIT 6");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($products) {
        echo "<h2>Featured Products</h2>";
        echo "<div class='products-grid'>";
        
        foreach ($products as $product) {
            echo "<div class='product-card'>";
            echo "<img src='" . htmlspecialchars($product['image_url']) . "' alt='" . htmlspecialchars($product['name']) . "'>";
            echo "<h3>" . htmlspecialchars($product['name']) . "</h3>";
            echo "<p class='price'>$" . number_format($product['price'], 2) . "</p>";
            echo "<form method='POST' action='add_to_cart.php'>";
            echo "<input type='hidden' name='product_id' value='" . $product['id'] . "'>";
            echo "<button type='submit'>Add to Cart</button>";
            echo "</form>";
            echo "</div>";
        }
        
        echo "</div>";
    } else {
        echo "<p>No products found in database.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>Error loading products: " . $e->getMessage() . "</p>";
}
?>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>