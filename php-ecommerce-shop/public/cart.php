<?php
require_once __DIR__ . '/../includes/config.php';

$page_title = "Shopping Cart";

// Get cart items
if (isLoggedIn()) {
    $stmt = $pdo->prepare("SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
                          FROM cart c JOIN products p ON c.product_id = p.id 
                          WHERE c.user_id = ?");
    $stmt->execute([getUserId()]);
} else {
    $stmt = $pdo->prepare("SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
                          FROM cart c JOIN products p ON c.product_id = p.id 
                          WHERE c.session_id = ?");
    $stmt->execute([getSessionId()]);
}
$cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Handle cart updates
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['update_cart'])) {
        foreach ($_POST['quantities'] as $cart_id => $quantity) {
            $quantity = max(1, (int)$quantity);
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
            $stmt->execute([$quantity, $cart_id]);
        }
        $_SESSION['message'] = "Cart updated!";
        $_SESSION['message_type'] = "success";
        redirect('/cart.php');
    }
    
    if (isset($_POST['remove_item'])) {
        $cart_id = (int)$_POST['cart_id'];
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
        $stmt->execute([$cart_id]);
        $_SESSION['message'] = "Item removed from cart";
        $_SESSION['message_type'] = "success";
        redirect('/cart.php');
    }
}

$total = 0;
foreach ($cart_items as $item) {
    $total += $item['price'] * $item['quantity'];
}

require_once INCLUDES_PATH . '/header.php';
?>

<div class="page-header">
    <h1>Shopping Cart</h1>
    <a href="index.php" class="back-link">← Continue Shopping</a>
</div>

<?php if (empty($cart_items)): ?>
    <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="index.php" class="btn-primary">Browse Products</a>
    </div>
<?php else: ?>
    <form method="POST" class="cart-form">
        <?php foreach ($cart_items as $item): ?>
            <div class="cart-item">
                <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                     alt="<?php echo htmlspecialchars($item['name']); ?>">
                <div class="item-details">
                    <h3><?php echo htmlspecialchars($item['name']); ?></h3>
                    <div class="item-price"><?php echo formatPrice($item['price']); ?></div>
                    <p>Stock: <?php echo $item['stock_quantity']; ?></p>
                </div>
                <div class="quantity-control">
                    <input type="number" name="quantities[<?php echo $item['id']; ?>]" 
                           value="<?php echo $item['quantity']; ?>" 
                           min="1" max="<?php echo $item['stock_quantity']; ?>" 
                           class="quantity-input">
                </div>
                <div class="item-actions">
                    <button type="submit" name="remove_item" 
                            value="<?php echo $item['id']; ?>" class="btn-danger"
                            onclick="return confirm('Remove this item?')">
                        Remove
                    </button>
                    <input type="hidden" name="cart_id" value="<?php echo $item['id']; ?>">
                </div>
            </div>
        <?php endforeach; ?>
        
        <div class="cart-actions">
            <button type="submit" name="update_cart" class="btn-secondary">Update Cart</button>
        </div>
    </form>
    
    <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
            <span>Subtotal</span>
            <span><?php echo formatPrice($total); ?></span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span><?php echo formatPrice($total); ?></span>
        </div>
        
        <?php if (isLoggedIn()): ?>
            <form method="POST" action="checkout.php">
                <button type="submit" class="btn-primary btn-large">Proceed to Checkout</button>
            </form>
        <?php else: ?>
            <p style="text-align: center; margin-top: 15px;">
                Please <a href="login.php">login</a> to checkout
            </p>
        <?php endif; ?>
    </div>
<?php endif; ?>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>