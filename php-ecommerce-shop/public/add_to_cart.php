<?php
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['product_id'])) {
    $product_id = (int)$_POST['product_id'];
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;
    
    // Check if product exists and has stock
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($product && $product['stock_quantity'] >= $quantity) {
        // Check if product already in cart
        if (isLoggedIn()) {
            $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([getUserId(), $product_id]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM cart WHERE session_id = ? AND product_id = ?");
            $stmt->execute([getSessionId(), $product_id]);
        }
        
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing) {
            // Update quantity
            $new_quantity = $existing['quantity'] + $quantity;
            if ($new_quantity <= $product['stock_quantity']) {
                $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
                $stmt->execute([$new_quantity, $existing['id']]);
                $_SESSION['message'] = "Cart updated successfully!";
                $_SESSION['message_type'] = "success";
            } else {
                $_SESSION['message'] = "Not enough stock available";
                $_SESSION['message_type'] = "error";
            }
        } else {
            // Add new item
            if (isLoggedIn()) {
                $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
                $stmt->execute([getUserId(), $product_id, $quantity]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, ?)");
                $stmt->execute([getSessionId(), $product_id, $quantity]);
            }
            $_SESSION['message'] = "Product added to cart!";
            $_SESSION['message_type'] = "success";
        }
    } else {
        $_SESSION['message'] = "Product not available";
        $_SESSION['message_type'] = "error";
    }
}

redirect('/index.php');