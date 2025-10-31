<nav class="nav flex-column">
    <div class="sidebar-sticky pt-3">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
            <span>Content</span>
        </h6>
        <ul class="nav flex-column mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="index.php">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="posts.php">
                    <i class="fas fa-file-alt"></i> Posts
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="categories.php">
                    <i class="fas fa-folder"></i> Categories
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="comments.php">
                    <i class="fas fa-comments"></i> Comments
                    <?php
                    $database = new Database();
                    $db = $database->getConnection();
                    $pending_count = $db->query("SELECT COUNT(*) FROM comments WHERE status = 'pending'")->fetchColumn();
                    if ($pending_count > 0): ?>
                    <span class="badge bg-danger"><?php echo $pending_count; ?></span>
                    <?php endif; ?>
                </a>
            </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
            <span>Users</span>
        </h6>
        <ul class="nav flex-column mb-2">
            <li class="nav-item">
                <a class="nav-link" href="users.php">
                    <i class="fas fa-users"></i> Manage Users
                </a>
            </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
            <span>Tools</span>
        </h6>
        <ul class="nav flex-column mb-2">
            <li class="nav-item">
                <a class="nav-link" href="contact-messages.php">
                    <i class="fas fa-envelope"></i> Contact Messages
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../rss.php" target="_blank">
                    <i class="fas fa-rss"></i> RSS Feed
                </a>
            </li>
        </ul>
    </div>
</nav>