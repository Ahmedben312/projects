<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Get stats for dashboard
$posts_count = $db->query("SELECT COUNT(*) FROM posts")->fetchColumn();
$published_posts = $db->query("SELECT COUNT(*) FROM posts WHERE status = 'published'")->fetchColumn();
$users_count = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
$comments_count = $db->query("SELECT COUNT(*) FROM comments")->fetchColumn();
$pending_comments = $db->query("SELECT COUNT(*) FROM comments WHERE status = 'pending'")->fetchColumn();

// Get recent posts
$recent_posts = $db->query("SELECT p.*, u.username as author_name 
                           FROM posts p 
                           LEFT JOIN users u ON p.author_id = u.id 
                           ORDER BY p.created_at DESC LIMIT 5")->fetchAll();

// Get recent comments
$recent_comments = $db->query("SELECT c.*, u.username, p.title as post_title 
                              FROM comments c 
                              LEFT JOIN users u ON c.user_id = u.id 
                              LEFT JOIN posts p ON c.post_id = p.id 
                              ORDER BY c.created_at DESC LIMIT 5")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Blog System</title>
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
                    <h1 class="h2">Dashboard</h1>
                </div>

                <!-- Stats Cards -->
                <div class="row">
                    <div class="col-md-3 mb-4">
                        <div class="card text-white bg-primary">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h4><?php echo $posts_count; ?></h4>
                                        <p class="mb-0">Total Posts</p>
                                    </div>
                                    <div class="align-self-center">
                                        <i class="fas fa-file-alt fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card text-white bg-success">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h4><?php echo $published_posts; ?></h4>
                                        <p class="mb-0">Published</p>
                                    </div>
                                    <div class="align-self-center">
                                        <i class="fas fa-check-circle fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card text-white bg-warning">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h4><?php echo $users_count; ?></h4>
                                        <p class="mb-0">Users</p>
                                    </div>
                                    <div class="align-self-center">
                                        <i class="fas fa-users fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card text-white bg-info">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h4><?php echo $comments_count; ?></h4>
                                        <p class="mb-0">Comments</p>
                                    </div>
                                    <div class="align-self-center">
                                        <i class="fas fa-comments fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Recent Posts -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">Recent Posts</h5>
                            </div>
                            <div class="card-body">
                                <?php if (empty($recent_posts)): ?>
                                    <p class="text-muted">No posts yet.</p>
                                <?php else: ?>
                                    <div class="list-group list-group-flush">
                                        <?php foreach ($recent_posts as $post): ?>
                                        <div class="list-group-item">
                                            <div class="d-flex w-100 justify-content-between">
                                                <h6 class="mb-1">
                                                    <a href="../post.php?id=<?php echo $post['id']; ?>" class="text-decoration-none">
                                                        <?php echo htmlspecialchars($post['title']); ?>
                                                    </a>
                                                </h6>
                                                <small class="text-muted"><?php echo formatDate($post['created_at']); ?></small>
                                            </div>
                                            <p class="mb-1 small text-muted">
                                                By <?php echo htmlspecialchars($post['author_name']); ?> 
                                                • <span class="badge bg-<?php echo $post['status'] == 'published' ? 'success' : 'secondary'; ?>">
                                                    <?php echo ucfirst($post['status']); ?>
                                                </span>
                                            </p>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                                <div class="mt-3">
                                    <a href="posts.php" class="btn btn-sm btn-outline-primary">View All Posts</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Comments -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">Recent Comments</h5>
                            </div>
                            <div class="card-body">
                                <?php if (empty($recent_comments)): ?>
                                    <p class="text-muted">No comments yet.</p>
                                <?php else: ?>
                                    <div class="list-group list-group-flush">
                                        <?php foreach ($recent_comments as $comment): ?>
                                        <div class="list-group-item">
                                            <div class="d-flex w-100 justify-content-between">
                                                <h6 class="mb-1"><?php echo htmlspecialchars($comment['username']); ?></h6>
                                                <small class="text-muted"><?php echo formatDate($comment['created_at']); ?></small>
                                            </div>
                                            <p class="mb-1"><?php echo htmlspecialchars(substr($comment['content'], 0, 100)); ?>...</p>
                                            <small class="text-muted">
                                                On: <a href="../post.php?id=<?php echo $comment['post_id']; ?>"><?php echo htmlspecialchars($comment['post_title']); ?></a>
                                                • <span class="badge bg-<?php echo $comment['status'] == 'approved' ? 'success' : ($comment['status'] == 'pending' ? 'warning' : 'danger'); ?>">
                                                    <?php echo ucfirst($comment['status']); ?>
                                                </span>
                                            </small>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                                <div class="mt-3">
                                    <a href="comments.php" class="btn btn-sm btn-outline-primary">View All Comments</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>