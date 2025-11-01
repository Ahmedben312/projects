<?php
require_once __DIR__ . '/../includes/config.php';

if (isLoggedIn()) {
    redirect('/index.php');
}

$page_title = "Register";
$errors = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = sanitize($_POST['username']);
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $full_name = sanitize($_POST['full_name']);
    $phone = sanitize($_POST['phone']);
    $address = sanitize($_POST['address']);
    $city = sanitize($_POST['city']);
    $postal_code = sanitize($_POST['postal_code']);
    $country = sanitize($_POST['country']);
    
    // Validation
    if (strlen($username) < 3) $errors[] = "Username must be at least 3 characters";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email format";
    if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters";
    if ($password !== $confirm_password) $errors[] = "Passwords do not match";
    if (empty($full_name)) $errors[] = "Full name is required";
    
    // Check if username or email exists
    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $errors[] = "Username or email already exists";
        }
    }
    
    // Register user
    if (empty($errors)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, full_name, phone, address, city, postal_code, country) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        if ($stmt->execute([$username, $email, $hashed_password, $full_name, $phone, $address, $city, $postal_code, $country])) {
            $_SESSION['message'] = "Registration successful! Please login.";
            $_SESSION['message_type'] = "success";
            redirect('/login.php');
        } else {
            $errors[] = "Registration failed. Please try again.";
        }
    }
}

require_once INCLUDES_PATH . '/header.php';
?>

<div class="auth-container">
    <div class="auth-form">
        <h1>Register</h1>
        
        <?php if (!empty($errors)): ?>
            <div class="error">
                <?php foreach ($errors as $error): ?>
                    <div><?php echo $error; ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label>Username *</label>
                <input type="text" name="username" required value="<?php echo $_POST['username'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required value="<?php echo $_POST['email'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Password *</label>
                <input type="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirm_password" required>
            </div>
            
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="full_name" required value="<?php echo $_POST['full_name'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value="<?php echo $_POST['phone'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Address</label>
                <textarea name="address"><?php echo $_POST['address'] ?? ''; ?></textarea>
            </div>
            
            <div class="form-group">
                <label>City</label>
                <input type="text" name="city" value="<?php echo $_POST['city'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Postal Code</label>
                <input type="text" name="postal_code" value="<?php echo $_POST['postal_code'] ?? ''; ?>">
            </div>
            
            <div class="form-group">
                <label>Country</label>
                <input type="text" name="country" value="<?php echo $_POST['country'] ?? ''; ?>">
            </div>
            
            <button type="submit" class="btn-primary">Register</button>
        </form>
        
        <div class="auth-link">
            Already have an account? <a href="login.php">Login here</a>
        </div>
    </div>
</div>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>