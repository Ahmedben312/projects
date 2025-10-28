<?php
session_start();

// Initialize posts array in session if not exists
if(!isset($_SESSION['posts'])) {
    $_SESSION['posts'] = [];
}

// Handle new post submission
if(isset($_POST['add_post'])) {
    $title = htmlspecialchars($_POST['title']);
    $content = htmlspecialchars($_POST['content']);
    $author = htmlspecialchars($_POST['author']);
    
    if(!empty($title) && !empty($content)) {
        $new_post = [
            'id' => uniqid(),
            'title' => $title,
            'content' => $content,
            'author' => $author,
            'date' => date('Y-m-d H:i:s')
        ];
        
        array_unshift($_SESSION['posts'], $new_post);
    }
}

// Handle post deletion
if(isset($_GET['delete'])) {
    $post_id = $_GET['delete'];
    $_SESSION['posts'] = array_filter($_SESSION['posts'], function($post) use ($post_id) {
        return $post['id'] !== $post_id;
    });
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Simple Blog</title>
    <style>
        .post { border: 1px solid #ccc; margin: 10px 0; padding: 15px; }
        .post-date { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>Simple Blog</h1>
    
    <!-- Add New Post Form -->
    <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
        <h3>Add New Post</h3>
        <form method="post">
            <input type="text" name="title" placeholder="Post Title" required style="width: 100%; margin: 5px 0;"><br>
            <input type="text" name="author" placeholder="Your Name" style="width: 100%; margin: 5px 0;"><br>
            <textarea name="content" placeholder="Post Content" required style="width: 100%; height: 100px; margin: 5px 0;"></textarea><br>
            <button type="submit" name="add_post">Publish Post</button>
        </form>
    </div>

    <!-- Display Posts -->
    <h2>Blog Posts</h2>
    <?php if(empty($_SESSION['posts'])): ?>
        <p>No posts yet. Be the first to post!</p>
    <?php else: ?>
        <?php foreach($_SESSION['posts'] as $post): ?>
            <div class="post">
                <h3><?php echo $post['title']; ?></h3>
                <p><?php echo nl2br($post['content']); ?></p>
                <div class="post-date">
                    Posted by <?php echo $post['author'] ?: 'Anonymous'; ?> 
                    on <?php echo $post['date']; ?>
                </div>
                <a href="?delete=<?php echo $post['id']; ?>" onclick="return confirm('Delete this post?')" style="color: red;">Delete</a>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>