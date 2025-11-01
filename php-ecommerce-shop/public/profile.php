<?php
require_once __DIR__ . '/../includes/config.php';

if (!isLoggedIn()) {
    redirect('/login.php');
}

$page_title = "My Profile";

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([getUserId()]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$errors = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $full_name = sanitize($_POST['full_name']);
    $email = sanitize($_POST['email']);
    $phone = sanitize($_POST['phone']);
    $address = sanitize($_POST['address']);
    $city = sanitize($_POST['city']);
    $postal_code = sanitize($_POST['postal_code']);
    $country = sanitize($_POST['country']);
    
    // Validation
    if (empty($full_name)) $errors[] = "Full name is required";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email format";
    
    // Check if email exists for another user
    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, getUserId()]);
        if ($stmt->fetch()) {
            $errors[] = "Email already exists";
        }
    }
    
    // Update profile
    if (empty($errors)) {
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, phone = ?, 
                              address = ?, city = ?, postal_code = ?, country = ? 
                              WHERE id = ?");
        
        if ($stmt->execute([$full_name, $email, $phone, $address, $city, $postal_code, $country, getUserId()])) {
            $_SESSION['message'] = "Profile updated successfully!";
            $_SESSION['message_type'] = "success";
            redirect('/profile.php');
        } else {
            $errors[] = "Update failed. Please try again.";
        }
    }
}

// Handle password change
if (isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    if (!password_verify($current_password, $user['password'])) {
        $errors[] = "Current password is incorrect";
    } elseif (strlen($new_password) < 6) {
        $errors[] = "New password must be at least 6 characters";
    } elseif ($new_password !== $confirm_password) {
        $errors[] = "New passwords do not match";
    } else {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        
        if ($stmt->execute([$hashed_password, getUserId()])) {
            $_SESSION['message'] = "Password changed successfully!";
            $_SESSION['message_type'] = "success";
            redirect('/profile.php');
        } else {
            $errors[] = "Password change failed";
        }
    }
}

require_once INCLUDES_PATH . '/header.php';
?>

<div class="page-header">
    <h1>My Profile</h1>
    <a href="index.php" class="back-link">← Back to Home</a>
</div>

<?php if (!empty($errors)): ?>
    <div class="error">
        <?php foreach ($errors as $error): ?>
            <div><?php echo $error; ?></div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<div class="profile-section">
    <h2>Profile Information</h2>
    <form method="POST">
        <div class="form-group">
            <label>Username</label>
            <input type="text" value="<?php echo htmlspecialchars($user['username']); ?>" readonly 
                   style="background: #f0f0f0;">
        </div>
        
        <div class="form-group">
            <label>Full Name *</label>
            <input type="text" name="full_name" required 
                   value="<?php echo htmlspecialchars($user['full_name']); ?>">
        </div>
        
        <div class="form-group">
            <label>Email *</label>
            <input type="email" name="email" required 
                   value="<?php echo htmlspecialchars($user['email']); ?>">
        </div>
        
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" 
                   value="<?php echo htmlspecialchars($user['phone']); ?>">
        </div>
        
        <div class="form-group">
            <label>Address</label>
            <textarea name="address"><?php echo htmlspecialchars($user['address']); ?></textarea>
        </div>
        
        <div class="form-group">
            <label>City</label>
            <input type="text" name="city" 
                   value="<?php echo htmlspecialchars($user['city']); ?>">
        </div>
        
        <div class="form-group">
            <label>Postal Code</label>
            <input type="text" name="postal_code" 
                   value="<?php echo htmlspecialchars($user['postal_code']); ?>">
        </div>
        
        <div class="form-group">
            <label>Country</label>
            <input type="text" name="country" 
                   value="<?php echo htmlspecialchars($user['country']); ?>">
        </div>
        
        <button type="submit" class="btn-primary">Update Profile</button>
    </form>
</div>

<div class="profile-section">
    <h2>Change Password</h2>
    <form method="POST">
        <div class="form-group">
            <label>Current Password *</label>
            <input type="password" name="current_password" required>
        </div>
        
        <div class="form-group">
            <label>New Password *</label>
            <input type="password" name="new_password" required>
        </div>
        
        <div class="form-group">
            <label>Confirm New Password *</label>
            <input type="password" name="confirm_password" required>
        </div>
        
        <button type="submit" name="change_password" class="btn-secondary">Change Password</button>
    </form>
</div>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>