<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Handle user actions
if (isset($_POST['action'])) {
    $user_id = (int)$_POST['user_id'];
    
    switch ($_POST['action']) {
        case 'update_role':
            $role = sanitize($_POST['role']);
            
            // Prevent admin from changing their own role
            if ($user_id == $_SESSION['user_id']) {
                $_SESSION['error'] = "You cannot change your own role.";
            } else {
                $query = "UPDATE users SET role = :role WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':role', $role);
                $stmt->bindParam(':id', $user_id);
                
                if ($stmt->execute()) {
                    $_SESSION['success'] = "User role updated successfully.";
                } else {
                    $_SESSION['error'] = "Failed to update user role.";
                }
            }
            break;
            
        case 'delete':
            // Prevent admin from deleting themselves
            if ($user_id == $_SESSION['user_id']) {
                $_SESSION['error'] = "You cannot delete your own account.";
            } else {
                // Check if user has posts
                $posts_query = "SELECT COUNT(*) FROM posts WHERE author_id = :user_id";
                $stmt = $db->prepare($posts_query);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->execute();
                $post_count = $stmt->fetchColumn();
                
                if ($post_count > 0) {
                    $_SESSION['error'] = "Cannot delete user with posts. Delete or reassign posts first.";
                } else {
                    $query = "DELETE FROM users WHERE id = :id";
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(':id', $user_id);
                    
                    if ($stmt->execute()) {
                        $_SESSION['success'] = "User deleted successfully.";
                    } else {
                        $_SESSION['error'] = "Failed to delete user.";
                    }
                }
            }
            break;
    }
    
    header('Location: users.php');
    exit();
}

// Get all users with post counts
$users_query = "SELECT u.*, COUNT(p.id) as post_count 
               FROM users u 
               LEFT JOIN posts p ON u.id = p.author_id 
               GROUP BY u.id 
               ORDER BY u.created_at DESC";
$users = $db->query($users_query)->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Users - Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/admin-header.php'; ?>

    <div class="container-fluid mt-4">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                <?php include 'includes/admin-sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Manage Users</h1>
                </div>

                <!-- Success/Error Messages -->
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
                <?php endif; ?>
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
                <?php endif; ?>

                <!-- Users Table -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($users)): ?>
                            <div class="alert alert-info">
                                No users found.
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Posts</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($users as $user): ?>
                                        <tr>
                                            <td>
                                                <?php echo htmlspecialchars($user['username']); ?>
                                                <?php if ($user['id'] == $_SESSION['user_id']): ?>
                                                <span class="badge bg-info">You</span>
                                                <?php endif; ?>
                                            </td>
                                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                                            <td>
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                    <input type="hidden" name="action" value="update_role">
                                                    <select name="role" class="form-select form-select-sm d-inline w-auto" 
                                                            onchange="this.form.submit()"
                                                            <?php echo $user['id'] == $_SESSION['user_id'] ? 'disabled' : ''; ?>>
                                                        <option value="subscriber" <?php echo $user['role'] == 'subscriber' ? 'selected' : ''; ?>>Subscriber</option>
                                                        <option value="author" <?php echo $user['role'] == 'author' ? 'selected' : ''; ?>>Author</option>
                                                        <option value="admin" <?php echo $user['role'] == 'admin' ? 'selected' : ''; ?>>Admin</option>
                                                    </select>
                                                </form>
                                            </td>
                                            <td>
                                                <span class="badge bg-primary"><?php echo $user['post_count']; ?></span>
                                            </td>
                                            <td><?php echo formatDate($user['created_at']); ?></td>
                                            <td>
                                                <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                    <input type="hidden" name="action" value="delete">
                                                    <button type="submit" class="btn btn-outline-danger btn-sm" 
                                                            onclick="return confirm('Are you sure you want to delete this user?')"
                                                            <?php echo $user['post_count'] > 0 ? 'disabled title="User has posts"' : ''; ?>>
                                                        <i class="fas fa-trash"></i> Delete
                                                    </button>
                                                </form>
                                                <?php else: ?>
                                                <span class="text-muted">Current User</span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>