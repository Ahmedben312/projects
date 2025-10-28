<?php
session_start();

// Simple user storage (in real application, use database)
$users_file = 'users.json';

// Initialize users file if it doesn't exist
if(!file_exists($users_file)) {
    file_put_contents($users_file, json_encode([]));
}

$users = json_decode(file_get_contents($users_file), true);
$message = "";

// Handle registration
if(isset($_POST['register'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    if(empty($username) || empty($password)) {
        $message = "Please fill in all fields.";
    } elseif($password !== $confirm_password) {
        $message = "Passwords do not match.";
    } elseif(isset($users[$username])) {
        $message = "Username already exists.";
    } else {
        $users[$username] = password_hash($password, PASSWORD_DEFAULT);
        file_put_contents($users_file, json_encode($users));
        $message = "Registration successful! You can now login.";
    }
}

// Handle login
if(isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    if(empty($username) || empty($password)) {
        $message = "Please fill in all fields.";
    } elseif(!isset($users[$username]) || !password_verify($password, $users[$username])) {
        $message = "Invalid username or password.";
    } else {
        $_SESSION['user'] = $username;
        header("Location: ".$_SERVER['PHP_SELF']);
        exit();
    }
}

// Handle logout
if(isset($_GET['logout'])) {
    session_destroy();
    header("Location: ".$_SERVER['PHP_SELF']);
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User System</title>
</head>
<body>
    <h2>User Registration & Login</h2>
    
    <?php if(isset($_SESSION['user'])): ?>
        <h3>Welcome, <?php echo htmlspecialchars($_SESSION['user']); ?>!</h3>
        <p>You are successfully logged in.</p>
        <a href="?logout=true">Logout</a>
    <?php else: ?>
        <?php if($message): ?>
            <p style="color: <?php echo strpos($message, 'successful') !== false ? 'green' : 'red'; ?>">
                <?php echo $message; ?>
            </p>
        <?php endif; ?>

        <div style="display: flex; gap: 50px;">
            <!-- Registration Form -->
            <div style="flex: 1;">
                <h3>Register</h3>
                <form method="post">
                    <input type="text" name="username" placeholder="Username" required><br><br>
                    <input type="password" name="password" placeholder="Password" required><br><br>
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required><br><br>
                    <button type="submit" name="register">Register</button>
                </form>
            </div>

            <!-- Login Form -->
            <div style="flex: 1;">
                <h3>Login</h3>
                <form method="post">
                    <input type="text" name="username" placeholder="Username" required><br><br>
                    <input type="password" name="password" placeholder="Password" required><br><br>
                    <button type="submit" name="login">Login</button>
                </form>
            </div>
        </div>
    <?php endif; ?>
</body>
</html>