<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAuthor();

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

// Handle post actions
if (isset($_POST['action'])) {
    $post_id = (int)$_POST['post_id'];
    
    switch ($_POST['action']) {
        case 'delete':
            $post->id = $post_id;
            if ($post->delete()) {
                $_SESSION['success'] = "Post deleted successfully.";
            } else {
                $_SESSION['error'] = "Failed to delete post.";
            }
            break;
            
        case 'publish':
            $query = "UPDATE posts SET status = 'published' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $post_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Post published successfully.";
            } else {
                $_SESSION['error'] = "Failed to publish post.";
            }
            break;
            
        case 'unpublish':
            $query = "UPDATE posts SET status = 'draft' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $post_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Post unpublished successfully.";
            } else {
                $_SESSION['error'] = "Failed to unpublish post.";
            }
            break;
    }
    
    header('Location: posts.php');
    exit();
}

// Get posts based on user role
if (isAdmin()) {
    $posts_query = "SELECT p.*, u.username as author_name, c.name as category_name 
                   FROM posts p 
                   LEFT JOIN users u ON p.author_id = u.id 
                   LEFT JOIN categories c ON p.category_id = c.id 
                   ORDER BY p.created_at DESC";
} else {
    $posts_query = "SELECT p.*, u.username as author_name, c.name as category_name 
                   FROM posts p 
                   LEFT JOIN users u ON p.author_id = u.id 
                   LEFT JOIN categories c ON p.category_id = c.id 
                   WHERE p.author_id = :author_id 
                   ORDER BY p.created_at DESC";
}

$stmt = $db->prepare($posts_query);
if (!isAdmin()) {
    $stmt->bindParam(':author_id', $_SESSION['user_id']);
}
$stmt->execute();
$posts = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Posts - Admin Panel</title>
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
                    <h1 class="h2">Manage Posts</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <a href="post-edit.php" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add New Post
                        </a>
                    </div>
                </div>

                <!-- Success/Error Messages -->
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
                <?php endif; ?>
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
                <?php endif; ?>

                <!-- Posts Table -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($posts)): ?>
                            <div class="alert alert-info">
                                No posts found. <a href="post-edit.php">Create your first post</a>.
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($posts as $post): ?>
                                        <tr>
                                            <td>
                                                <a href="../post.php?id=<?php echo $post['id']; ?>" class="text-decoration-none">
                                                    <?php echo htmlspecialchars($post['title']); ?>
                                                </a>
                                            </td>
                                            <td><?php echo htmlspecialchars($post['author_name']); ?></td>
                                            <td><?php echo htmlspecialchars($post['category_name']); ?></td>
                                            <td>
                                                <span class="badge bg-<?php echo $post['status'] == 'published' ? 'success' : 'secondary'; ?>">
                                                    <?php echo ucfirst($post['status']); ?>
                                                </span>
                                            </td>
                                            <td><?php echo formatDate($post['created_at']); ?></td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <a href="post-edit.php?id=<?php echo $post['id']; ?>" class="btn btn-outline-primary">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <?php if ($post['status'] == 'published'): ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                                                        <input type="hidden" name="action" value="unpublish">
                                                        <button type="submit" class="btn btn-outline-warning" onclick="return confirm('Unpublish this post?')">
                                                            <i class="fas fa-eye-slash"></i>
                                                        </button>
                                                    </form>
                                                    <?php else: ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                                                        <input type="hidden" name="action" value="publish">
                                                        <button type="submit" class="btn btn-outline-success" onclick="return confirm('Publish this post?')">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                    </form>
                                                    <?php endif; ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                                                        <input type="hidden" name="action" value="delete">
                                                        <button type="submit" class="btn btn-outline-danger" onclick="return confirm('Are you sure you want to delete this post?')">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </form>
                                                </div>
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