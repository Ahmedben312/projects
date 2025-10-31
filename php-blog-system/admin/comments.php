<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Handle comment actions
if (isset($_POST['action'])) {
    $comment_id = (int)$_POST['comment_id'];
    
    switch ($_POST['action']) {
        case 'approve':
            $query = "UPDATE comments SET status = 'approved' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $comment_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Comment approved successfully.";
            } else {
                $_SESSION['error'] = "Failed to approve comment.";
            }
            break;
            
        case 'reject':
            $query = "UPDATE comments SET status = 'rejected' WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $comment_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Comment rejected successfully.";
            } else {
                $_SESSION['error'] = "Failed to reject comment.";
            }
            break;
            
        case 'delete':
            $query = "DELETE FROM comments WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $comment_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Comment deleted successfully.";
            } else {
                $_SESSION['error'] = "Failed to delete comment.";
            }
            break;
    }
    
    header('Location: comments.php');
    exit();
}

// Get filter
$filter = $_GET['filter'] ?? 'all';

// Build query based on filter
$where = '';
switch ($filter) {
    case 'pending':
        $where = "WHERE c.status = 'pending'";
        break;
    case 'approved':
        $where = "WHERE c.status = 'approved'";
        break;
    case 'rejected':
        $where = "WHERE c.status = 'rejected'";
        break;
    default:
        $where = '';
}

// Get all comments with post and user info
$comments_query = "SELECT c.*, u.username, p.title as post_title, p.id as post_id 
                  FROM comments c 
                  LEFT JOIN users u ON c.user_id = u.id 
                  LEFT JOIN posts p ON c.post_id = p.id 
                  $where 
                  ORDER BY c.created_at DESC";
$comments = $db->query($comments_query)->fetchAll();

// Get counts for filters
$counts_query = "SELECT 
                 COUNT(*) as total,
                 SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                 SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                 SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
                 FROM comments";
$counts = $db->query($counts_query)->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Comments - Admin Panel</title>
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
                    <h1 class="h2">Manage Comments</h1>
                    <div class="btn-group">
                        <a href="comments.php?filter=all" class="btn btn-outline-primary <?php echo $filter == 'all' ? 'active' : ''; ?>">
                            All <span class="badge bg-secondary"><?php echo $counts['total']; ?></span>
                        </a>
                        <a href="comments.php?filter=pending" class="btn btn-outline-warning <?php echo $filter == 'pending' ? 'active' : ''; ?>">
                            Pending <span class="badge bg-warning"><?php echo $counts['pending']; ?></span>
                        </a>
                        <a href="comments.php?filter=approved" class="btn btn-outline-success <?php echo $filter == 'approved' ? 'active' : ''; ?>">
                            Approved <span class="badge bg-success"><?php echo $counts['approved']; ?></span>
                        </a>
                        <a href="comments.php?filter=rejected" class="btn btn-outline-danger <?php echo $filter == 'rejected' ? 'active' : ''; ?>">
                            Rejected <span class="badge bg-danger"><?php echo $counts['rejected']; ?></span>
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

                <!-- Comments Table -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($comments)): ?>
                            <div class="alert alert-info">
                                No comments found.
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Post</th>
                                            <th>User</th>
                                            <th>Comment</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($comments as $comment): ?>
                                        <tr>
                                            <td>
                                                <a href="../post.php?id=<?php echo $comment['post_id']; ?>" class="text-decoration-none">
                                                    <?php echo htmlspecialchars($comment['post_title']); ?>
                                                </a>
                                            </td>
                                            <td><?php echo htmlspecialchars($comment['username']); ?></td>
                                            <td>
                                                <div class="comment-content">
                                                    <?php echo nl2br(htmlspecialchars($comment['content'])); ?>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-<?php 
                                                    echo $comment['status'] == 'approved' ? 'success' : 
                                                           ($comment['status'] == 'pending' ? 'warning' : 'danger'); 
                                                ?>">
                                                    <?php echo ucfirst($comment['status']); ?>
                                                </span>
                                            </td>
                                            <td><?php echo formatDate($comment['created_at']); ?></td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <?php if ($comment['status'] != 'approved'): ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="comment_id" value="<?php echo $comment['id']; ?>">
                                                        <input type="hidden" name="action" value="approve">
                                                        <button type="submit" class="btn btn-outline-success" title="Approve">
                                                            <i class="fas fa-check"></i>
                                                        </button>
                                                    </form>
                                                    <?php endif; ?>
                                                    <?php if ($comment['status'] != 'rejected'): ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="comment_id" value="<?php echo $comment['id']; ?>">
                                                        <input type="hidden" name="action" value="reject">
                                                        <button type="submit" class="btn btn-outline-warning" title="Reject">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </form>
                                                    <?php endif; ?>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="comment_id" value="<?php echo $comment['id']; ?>">
                                                        <input type="hidden" name="action" value="delete">
                                                        <button type="submit" class="btn btn-outline-danger" 
                                                                onclick="return confirm('Are you sure you want to delete this comment?')" 
                                                                title="Delete">
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