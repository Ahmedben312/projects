<?php
include 'includes/functions.php';

if (!isset($_GET['id'])) {
    header('Location: index.php');
    exit();
}

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

$post_id = (int)$_GET['id'];
$post_data = $post->getPost($post_id);

if (!$post_data || $post_data['status'] != 'published') {
    header('HTTP/1.0 404 Not Found');
    echo 'Post not found.';
    exit();
}

// Handle comment submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['comment'])) {
    if (!isLoggedIn()) {
        $_SESSION['error'] = "Please login to comment.";
    } else {
        $comment_content = sanitize($_POST['comment_content']);
        $parent_id = isset($_POST['parent_id']) ? (int)$_POST['parent_id'] : null;
        
        if (!empty($comment_content)) {
            $query = "INSERT INTO comments (post_id, user_id, parent_id, content, status) 
                     VALUES (:post_id, :user_id, :parent_id, :content, 'pending')";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':post_id', $post_id);
            $stmt->bindParam(':user_id', $_SESSION['user_id']);
            $stmt->bindParam(':parent_id', $parent_id);
            $stmt->bindParam(':content', $comment_content);
            
            if ($stmt->execute()) {
                $_SESSION['success'] = "Comment submitted and awaiting approval.";
            } else {
                $_SESSION['error'] = "Failed to submit comment.";
            }
        } else {
            $_SESSION['error'] = "Comment cannot be empty.";
        }
    }
}

// Get comments for this post
$comments_query = "SELECT c.*, u.username 
                  FROM comments c 
                  LEFT JOIN users u ON c.user_id = u.id 
                  WHERE c.post_id = :post_id AND c.status = 'approved' 
                  ORDER BY c.created_at ASC";
$stmt = $db->prepare($comments_query);
$stmt->bindParam(':post_id', $post_id);
$stmt->execute();
$comments = $stmt->fetchAll();

// Get post tags
$tags_query = "SELECT t.* FROM tags t
              INNER JOIN post_tags pt ON t.id = pt.tag_id
              WHERE pt.post_id = :post_id";
$stmt = $db->prepare($tags_query);
$stmt->bindParam(':post_id', $post_id);
$stmt->execute();
$tags = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($post_data['title']); ?> - Blog System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8">
                <!-- Success/Error Messages -->
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
                <?php endif; ?>
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
                <?php endif; ?>

                <!-- Post Content -->
                <article>
                    <h1><?php echo htmlspecialchars($post_data['title']); ?></h1>
                    
                    <div class="text-muted mb-3">
                        <i class="fas fa-user"></i> By <?php echo htmlspecialchars($post_data['author_name']); ?>
                        <i class="fas fa-calendar ms-2"></i> <?php echo formatDate($post_data['created_at']); ?>
                        <i class="fas fa-folder ms-2"></i> <?php echo htmlspecialchars($post_data['category_name']); ?>
                    </div>

                    <?php if ($post_data['featured_image']): ?>
                    <img src="uploads/images/<?php echo $post_data['featured_image']; ?>" 
                         class="img-fluid featured-image mb-4" 
                         alt="<?php echo htmlspecialchars($post_data['title']); ?>">
                    <?php endif; ?>

                    <div class="post-content">
                        <?php echo nl2br(htmlspecialchars($post_data['content'])); ?>
                    </div>

                    <!-- Tags -->
                    <?php if (!empty($tags)): ?>
                    <div class="mt-4">
                        <strong>Tags:</strong>
                        <?php foreach ($tags as $tag): ?>
                            <span class="badge bg-secondary me-1"><?php echo htmlspecialchars($tag['name']); ?></span>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </article>

                <!-- Comments Section -->
                <section class="mt-5">
                    <h3>Comments (<?php echo count($comments); ?>)</h3>
                    
                    <!-- Comment Form -->
                    <?php if (isLoggedIn()): ?>
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">Leave a Comment</h5>
                            <form method="POST">
                                <input type="hidden" name="comment" value="1">
                                <div class="mb-3">
                                    <textarea class="form-control" name="comment_content" rows="4" 
                                              placeholder="Write your comment here..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Comment</button>
                            </form>
                        </div>
                    </div>
                    <?php else: ?>
                    <div class="alert alert-info">
                        Please <a href="login.php">login</a> to leave a comment.
                    </div>
                    <?php endif; ?>

                    <!-- Comments List -->
                    <?php if (empty($comments)): ?>
                        <p>No comments yet. Be the first to comment!</p>
                    <?php else: ?>
                        <?php foreach ($comments as $comment): ?>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <strong><?php echo htmlspecialchars($comment['username']); ?></strong>
                                    <small class="text-muted"><?php echo formatDate($comment['created_at']); ?></small>
                                </div>
                                <p class="mt-2 mb-0"><?php echo nl2br(htmlspecialchars($comment['content'])); ?></p>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </section>
            </div>
            
            <div class="col-md-4">
                <?php include 'includes/sidebar.php'; ?>
            </div>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>