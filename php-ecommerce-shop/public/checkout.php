<?php
require_once __DIR__ . '/../includes/config.php';

if (!isLoggedIn()) {
    redirect('/login.php');
}

$page_title = "Checkout";

// Get user info
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([getUserId()]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Get cart items
$stmt = $pdo->prepare("SELECT c.*, p.name, p.price, p.stock_quantity 
                      FROM cart c JOIN products p ON c.product_id = p.id 
                      WHERE c.user_id = ?");
$stmt->execute([getUserId()]);
$cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($cart_items)) {
    redirect('/cart.php');
}

$total = 0;
foreach ($cart_items as $item) {
    $total += $item['price'] * $item['quantity'];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $payment_method = sanitize($_POST['payment_method']);
    $shipping_address = sanitize($_POST['shipping_address']);
    
    // Validate stock
    $stock_error = false;
    foreach ($cart_items as $item) {
        if ($item['quantity'] > $item['stock_quantity']) {
            $stock_error = true;
            break;
        }
    }
    
    if (!$stock_error) {
        try {
            $pdo->beginTransaction();
            
            // Create order
            $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) 
                                  VALUES (?, ?, ?, ?)");
            $stmt->execute([getUserId(), $total, $payment_method, $shipping_address]);
            $order_id = $pdo->lastInsertId();
            
            // Add order items and update stock
            foreach ($cart_items as $item) {
                $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) 
                                      VALUES (?, ?, ?, ?)");
                $stmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
                
                $stmt = $pdo->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
                $stmt->execute([$item['quantity'], $item['product_id']]);
            }
            
            // Clear cart
            $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
            $stmt->execute([getUserId()]);
            
            // Update order status if payment method is COD
            if ($payment_method == 'cod') {
                $stmt = $pdo->prepare("UPDATE orders SET payment_status = 'pending' WHERE id = ?");
                $stmt->execute([$order_id]);
            }
            
            $pdo->commit();
            
            // Send email notification
            $email_message = "
                <h2>Order Confirmation</h2>
                <p>Thank you for your order!</p>
                <p>Order ID: #$order_id</p>
                <p>Total: " . formatPrice($total) . "</p>
                <p>We'll notify you when your order ships.</p>
            ";
            sendEmail($user['email'], "Order Confirmation #$order_id", $email_message);
            
            $_SESSION['message'] = "Order placed successfully! Order ID: #$order_id";
            $_SESSION['message_type'] = "success";
            redirect('/orders.php');
            
        } catch (Exception $e) {
            $pdo->rollBack();
            $_SESSION['message'] = "Error processing order. Please try again.";
            $_SESSION['message_type'] = "error";
        }
    } else {
        $_SESSION['message'] = "Some items are out of stock. Please update your cart.";
        $_SESSION['message_type'] = "error";
        redirect('/cart.php');
    }
}

require_once INCLUDES_PATH . '/header.php';
?>

<div class="page-header">
    <h1>Checkout</h1>
    <a href="cart.php" class="back-link">← Back to Cart</a>
</div>

<form method="POST">
    <div class="checkout-grid">
        <div>
            <div class="checkout-section">
                <h2>Shipping Information</h2>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['full_name']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="<?php echo htmlspecialchars($user['email']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['phone']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label>Shipping Address *</label>
                    <textarea name="shipping_address" required><?php 
                        echo htmlspecialchars($user['address'] . "\n" . $user['city'] . ", " . $user['postal_code'] . "\n" . $user['country']); 
                    ?></textarea>
                </div>
            </div>
            
            <div class="checkout-section">
                <h2>Payment Method</h2>
                <div class="form-group">
                    <label>Select Payment Method *</label>
                    <select name="payment_method" required>
                        <option value="">Choose...</option>
                        <option value="stripe">Credit/Debit Card (Stripe)</option>
                        <option value="paypal">PayPal</option>
                        <option value="cod">Cash on Delivery</option>
                    </select>
                </div>
                <p class="note">
                    Note: This is a demo. Stripe and PayPal integrations use sandbox mode.
                </p>
            </div>
        </div>
        
        <div class="checkout-section">
            <h2>Order Summary</h2>
            <?php foreach ($cart_items as $item): ?>
                <div class="order-item">
                    <div>
                        <strong><?php echo htmlspecialchars($item['name']); ?></strong>
                        <br>
                        <small>Qty: <?php echo $item['quantity']; ?></small>
                    </div>
                    <div><?php echo formatPrice($item['price'] * $item['quantity']); ?></div>
                </div>
            <?php endforeach; ?>
            
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
            
            <button type="submit" class="btn-primary btn-large">Place Order</button>
        </div>
    </div>
</form>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>