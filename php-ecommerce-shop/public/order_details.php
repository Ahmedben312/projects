<?php
require_once __DIR__ . '/../includes/config.php';

if (!isLoggedIn()) {
    redirect('/login.php');
}

$page_title = "Order Details";
$order_id = $_GET['id'] ?? 0;

// Get order details
$stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?");
$stmt->execute([$order_id, getUserId()]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$order) {
    redirect('/orders.php');
}

// Get order items
$stmt = $pdo->prepare("SELECT oi.*, p.name, p.image_url 
                      FROM order_items oi 
                      JOIN products p ON oi.product_id = p.id 
                      WHERE oi.order_id = ?");
$stmt->execute([$order_id]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

require_once INCLUDES_PATH . '/header.php';
?>

<div class="page-header">
    <h1>Order #<?php echo $order_id; ?></h1>
    <a href="orders.php" class="back-link">← Back to Orders</a>
</div>

<span class="order-status status-<?php echo $order['status']; ?>">
    <?php echo ucfirst($order['status']); ?>
</span>

<div class="detail-section">
    <h2>Order Information</h2>
    <div class="detail-grid">
        <div class="detail-item">
            <div class="detail-label">Order Date</div>
            <div class="detail-value">
                <?php echo date('F j, Y g:i A', strtotime($order['created_at'])); ?>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Payment Method</div>
            <div class="detail-value"><?php echo strtoupper($order['payment_method']); ?></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Payment Status</div>
            <div class="detail-value"><?php echo ucfirst($order['payment_status']); ?></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Total Amount</div>
            <div class="detail-value"><?php echo formatPrice($order['total_amount']); ?></div>
        </div>
    </div>
</div>

<div class="detail-section">
    <h2>Shipping Address</h2>
    <p style="white-space: pre-line;"><?php echo htmlspecialchars($order['shipping_address']); ?></p>
</div>

<div class="detail-section">
    <h2>Order Items</h2>
    <?php foreach ($items as $item): ?>
        <div class="order-item">
            <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                 alt="<?php echo htmlspecialchars($item['name']); ?>">
            <div class="item-info">
                <div class="item-name"><?php echo htmlspecialchars($item['name']); ?></div>
                <div>Quantity: <?php echo $item['quantity']; ?></div>
                <div class="item-price"><?php echo formatPrice($item['price']); ?> each</div>
            </div>
            <div style="text-align: right;">
                <strong><?php echo formatPrice($item['price'] * $item['quantity']); ?></strong>
            </div>
        </div>
    <?php endforeach; ?>
    
    <div class="order-total">
        <div class="summary-row total">
            <span>Total</span>
            <span><?php echo formatPrice($order['total_amount']); ?></span>
        </div>
    </div>
</div>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>