<?php
require_once __DIR__ . '/../includes/config.php';

if (!isLoggedIn()) {
    redirect('/login.php');
}

$page_title = "My Orders";

// Get user orders
$stmt = $pdo->prepare("SELECT o.*, 
                      (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
                      FROM orders o 
                      WHERE o.user_id = ? 
                      ORDER BY o.created_at DESC");
$stmt->execute([getUserId()]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

require_once INCLUDES_PATH . '/header.php';
?>

<div class="page-header">
    <h1>My Orders</h1>
    <a href="index.php" class="back-link">← Back to Home</a>
</div>

<?php if (empty($orders)): ?>
    <div class="empty-state">
        <h2>No orders yet</h2>
        <p>Start shopping to place your first order!</p>
        <a href="index.php" class="btn-primary">Browse Products</a>
    </div>
<?php else: ?>
    <?php foreach ($orders as $order): ?>
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #<?php echo $order['id']; ?></div>
                    <div class="order-date">
                        <?php echo date('F j, Y g:i A', strtotime($order['created_at'])); ?>
                    </div>
                </div>
                <div>
                    <span class="order-status status-<?php echo $order['status']; ?>">
                        <?php echo ucfirst($order['status']); ?>
                    </span>
                </div>
            </div>
            
            <div class="order-details">
                <div class="detail-item">
                    <div class="detail-label">Total Amount</div>
                    <div class="detail-value"><?php echo formatPrice($order['total_amount']); ?></div>
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
                    <div class="detail-label">Items</div>
                    <div class="detail-value"><?php echo $order['item_count']; ?> item(s)</div>
                </div>
            </div>
            
            <a href="order_details.php?id=<?php echo $order['id']; ?>" class="btn-secondary">
                View Details
            </a>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>