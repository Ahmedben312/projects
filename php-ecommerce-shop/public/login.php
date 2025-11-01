<?php
require_once __DIR__ . '/../includes/config.php';

if (isLoggedIn()) {
    redirect('/index.php');
}

$page_title = "Login";
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = sanitize($_POST['username']);
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        // Merge session cart with user cart
        $session_id = getSessionId();
        $stmt = $pdo->prepare("UPDATE cart SET user_id = ?, session_id = NULL 
                              WHERE session_id = ? AND product_id NOT IN 
                              (SELECT product_id FROM (SELECT product_id FROM cart WHERE user_id = ?) as temp)");
        $stmt->execute([$user['id'], $session_id, $user['id']]);
        
        $_SESSION['message'] = "Welcome back, " . $user['username'] . "!";
        $_SESSION['message_type'] = "success";
        redirect('/index.php');
    } else {
        $error = "Invalid username or password";
    }
}

require_once INCLUDES_PATH . '/header.php';
?>

<div class="auth-container">
    <div class="auth-form">
        <h1>Login</h1>
        
        <?php if ($error): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label>Username or Email</label>
                <input type="text" name="username" required>
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            
            <button type="submit" class="btn-primary">Login</button>
        </form>
        
        <div class="auth-link">
            Don't have an account? <a href="register.php">Register here</a>
        </div>
    </div>
</div>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>