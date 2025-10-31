<?php
include 'includes/functions.php';

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

$keyword = isset($_GET['q']) ? sanitize($_GET['q']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

if (!empty($keyword)) {
    $results = $post->search($keyword, $page);
} else {
    $results = $post->getPosts($page);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results - Blog System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8">
                <h1>Search Results</h1>
                
                <?php if (!empty($keyword)): ?>
                    <p>Showing results for: "<strong><?php echo htmlspecialchars($keyword); ?></strong>"</p>
                <?php endif; ?>

                <?php if ($results->rowCount() > 0): ?>
                    <?php while ($row = $results->fetch(PDO::FETCH_ASSOC)): ?>
                    <div class="card mb-4">
                        <?php if ($row['featured_image']): ?>
                        <img src="uploads/images/<?php echo $row['featured_image']; ?>" class="card-img-top" alt="<?php echo $row['title']; ?>">
                        <?php endif; ?>
                        <div class="card-body">
                            <h2 class="card-title">
                                <a href="post.php?id=<?php echo $row['id']; ?>" class="text-decoration-none">
                                    <?php echo htmlspecialchars($row['title']); ?>
                                </a>
                            </h2>
                            <p class="text-muted">
                                By <?php echo htmlspecialchars($row['author_name']); ?> 
                                on <?php echo formatDate($row['created_at']); ?>
                            </p>
                            <p class="card-text"><?php echo htmlspecialchars($row['excerpt']); ?></p>
                            <a href="post.php?id=<?php echo $row['id']; ?>" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div class="alert alert-info">
                        <?php if (!empty($keyword)): ?>
                            No posts found matching your search criteria.
                        <?php else: ?>
                            No posts available.
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="col-md-4">
                <?php include 'includes/sidebar.php'; ?>
            </div>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>