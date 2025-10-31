<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Handle message actions
if (isset($_POST['action'])) {
    $message_id = (int)$_POST['message_id'];
    
    switch ($_POST['action']) {
        case 'mark_read':
            $query = "UPDATE contact_messages SET is_read = TRUE WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $message_id);
            $stmt->execute();
            $_SESSION['success'] = "Message marked as read.";
            break;
            
        case 'mark_unread':
            $query = "UPDATE contact_messages SET is_read = FALSE WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $message_id);
            $stmt->execute();
            $_SESSION['success'] = "Message marked as unread.";
            break;
            
        case 'delete':
            $query = "DELETE FROM contact_messages WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $message_id);
            $stmt->execute();
            $_SESSION['success'] = "Message deleted successfully.";
            break;
    }
    
    header('Location: contact-messages.php');
    exit();
}

// Get filter
$filter = $_GET['filter'] ?? 'all';

// Build query based on filter
$where = '';
switch ($filter) {
    case 'unread':
        $where = "WHERE is_read = FALSE";
        break;
    case 'read':
        $where = "WHERE is_read = TRUE";
        break;
    default:
        $where = '';
}

// Get all contact messages
$messages_query = "SELECT * FROM contact_messages $where ORDER BY created_at DESC";
$messages = $db->query($messages_query)->fetchAll();

// Get counts
$counts_query = "SELECT 
                 COUNT(*) as total,
                 SUM(CASE WHEN is_read = TRUE THEN 1 ELSE 0 END) as read_count,
                 SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread_count
                 FROM contact_messages";
$counts = $db->query($counts_query)->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages - Admin Panel</title>
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
                    <h1 class="h2">Contact Messages</h1>
                    <div class="btn-group">
                        <a href="contact-messages.php?filter=all" class="btn btn-outline-primary <?php echo $filter == 'all' ? 'active' : ''; ?>">
                            All <span class="badge bg-secondary"><?php echo $counts['total']; ?></span>
                        </a>
                        <a href="contact-messages.php?filter=unread" class="btn btn-outline-warning <?php echo $filter == 'unread' ? 'active' : ''; ?>">
                            Unread <span class="badge bg-warning"><?php echo $counts['unread_count']; ?></span>
                        </a>
                        <a href="contact-messages.php?filter=read" class="btn btn-outline-success <?php echo $filter == 'read' ? 'active' : ''; ?>">
                            Read <span class="badge bg-success"><?php echo $counts['read_count']; ?></span>
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

                <!-- Messages List -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($messages)): ?>
                            <div class="alert alert-info">
                                No messages found.
                            </div>
                        <?php else: ?>
                            <div class="list-group list-group-flush">
                                <?php foreach ($messages as $message): ?>
                                <div class="list-group-item <?php echo !$message['is_read'] ? 'bg-light fw-bold' : ''; ?>">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">
                                            <?php echo htmlspecialchars($message['name']); ?>
                                            <?php if (!$message['is_read']): ?>
                                            <span class="badge bg-warning">New</span>
                                            <?php endif; ?>
                                        </h5>
                                        <small><?php echo formatDate($message['created_at']); ?></small>
                                    </div>
                                    <p class="mb-1">
                                        <strong>Email:</strong> 
                                        <a href="mailto:<?php echo htmlspecialchars($message['email']); ?>">
                                            <?php echo htmlspecialchars($message['email']); ?>
                                        </a>
                                    </p>
                                    <?php if ($message['subject']): ?>
                                    <p class="mb-1"><strong>Subject:</strong> <?php echo htmlspecialchars($message['subject']); ?></p>
                                    <?php endif; ?>
                                    <p class="mb-3"><?php echo nl2br(htmlspecialchars($message['message'])); ?></p>
                                    <div class="mt-2">
                                        <?php if (!$message['is_read']): ?>
                                        <form method="POST" class="d-inline">
                                            <input type="hidden" name="message_id" value="<?php echo $message['id']; ?>">
                                            <input type="hidden" name="action" value="mark_read">
                                            <button type="submit" class="btn btn-sm btn-outline-success">
                                                <i class="fas fa-check"></i> Mark as Read
                                            </button>
                                        </form>
                                        <?php else: ?>
                                        <form method="POST" class="d-inline">
                                            <input type="hidden" name="message_id" value="<?php echo $message['id']; ?>">
                                            <input type="hidden" name="action" value="mark_unread">
                                            <button type="submit" class="btn btn-sm btn-outline-warning">
                                                <i class="fas fa-envelope"></i> Mark as Unread
                                            </button>
                                        </form>
                                        <?php endif; ?>
                                        <form method="POST" class="d-inline">
                                            <input type="hidden" name="message_id" value="<?php echo $message['id']; ?>">
                                            <input type="hidden" name="action" value="delete">
                                            <button type="submit" class="btn btn-sm btn-outline-danger" 
                                                    onclick="return confirm('Are you sure you want to delete this message?')">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <?php endforeach; ?>
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