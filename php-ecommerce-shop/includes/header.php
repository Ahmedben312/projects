<?php
// Get cart count for display
$cart_count = getCartCount();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title . ' - ' . SITE_NAME : SITE_NAME; ?></title>
    <link rel="stylesheet" href="<?php echo ASSETS_PATH; ?>/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="<?php echo SITE_URL; ?>/public/index.php"><?php echo SITE_NAME; ?></a>
                </div>
                <nav>
                    <a href="<?php echo SITE_URL; ?>/public/index.php">Home</a>
                    <?php if (isLoggedIn()): ?>
                        <a href="<?php echo SITE_URL; ?>/public/profile.php">Profile</a>
                        <a href="<?php echo SITE_URL; ?>/public/orders.php">My Orders</a>
                        <a href="<?php echo SITE_URL; ?>/public/logout.php">Logout</a>
                    <?php else: ?>
                        <a href="<?php echo SITE_URL; ?>/public/login.php">Login</a>
                        <a href="<?php echo SITE_URL; ?>/public/register.php">Register</a>
                    <?php endif; ?>
                    <a href="<?php echo SITE_URL; ?>/public/cart.php" class="cart-icon">
                        Cart 🛒
                        <?php if ($cart_count > 0): ?>
                            <span class="cart-count"><?php echo $cart_count; ?></span>
                        <?php endif; ?>
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <main class="container">
        <?php if (isset($_SESSION['message'])): ?>
            <div class="message <?php echo $_SESSION['message_type'] ?? 'success'; ?>">
                <?php 
                echo $_SESSION['message']; 
                unset($_SESSION['message'], $_SESSION['message_type']);
                ?>
            </div>
        <?php endif; ?>