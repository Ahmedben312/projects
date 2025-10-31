<?php
$database = new Database();
$db = $database->getConnection();

// Get categories for sidebar
$categoryQuery = "SELECT * FROM categories ORDER BY name";
$categories = $db->query($categoryQuery)->fetchAll();

// Get recent posts
$recentQuery = "SELECT id, title, created_at FROM posts 
                WHERE status = 'published' 
                ORDER BY created_at DESC LIMIT 5";
$recentPosts = $db->query($recentQuery)->fetchAll();
?>
<div class="sidebar">
    <!-- Search Form -->
    <div class="mb-4">
        <h5>Search</h5>
        <form action="search.php" method="GET" class="d-flex">
            <input type="text" name="q" class="form-control me-2" placeholder="Search posts...">
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-search"></i>
            </button>
        </form>
    </div>

    <!-- Categories -->
    <div class="mb-4">
        <h5>Categories</h5>
        <ul class="list-unstyled">
            <?php foreach ($categories as $category): ?>
            <li>
                <a href="category.php?id=<?php echo $category['id']; ?>" class="text-decoration-none">
                    <?php echo htmlspecialchars($category['name']); ?>
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- Recent Posts -->
    <div class="mb-4">
        <h5>Recent Posts</h5>
        <ul class="list-unstyled">
            <?php foreach ($recentPosts as $post): ?>
            <li class="mb-2">
                <a href="post.php?id=<?php echo $post['id']; ?>" class="text-decoration-none">
                    <?php echo htmlspecialchars($post['title']); ?>
                </a>
                <br>
                <small class="text-muted"><?php echo formatDate($post['created_at']); ?></small>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- RSS Feed -->
    <div class="mb-4">
        <h5>Subscribe</h5>
        <a href="rss.php" class="btn btn-outline-primary btn-sm">
            <i class="fas fa-rss"></i> RSS Feed
        </a>
    </div>
</div>