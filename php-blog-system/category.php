<?php
include 'includes/functions.php';

if (!isset($_GET['id'])) {
    header('Location: index.php');
    exit();
}

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

$category_id = (int)$_GET['id'];
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

// Get category info
$category_query = "SELECT * FROM categories WHERE id = :id";
$stmt = $db->prepare($category_query);
$stmt->bindParam(':id', $category_id);
$stmt->execute();
$category = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$category) {
    header('HTTP/1.0 404 Not Found');
    echo 'Category not found.';
    exit();
}

$posts = $post->getPostsByCategory($category_id, $page);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category: <?php echo htmlspecialchars($category['name']); ?> - Blog System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8">
                <h1>Category: <?php echo htmlspecialchars($category['name']); ?></h1>
                <?php if ($category['description']): ?>
                    <p class="lead"><?php echo htmlspecialchars($category['description']); ?></p>
                <?php endif; ?>

                <?php if ($posts->rowCount() > 0): ?>
                    <?php while ($row = $posts->fetch(PDO::FETCH_ASSOC)): ?>
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
                        No posts found in this category.
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