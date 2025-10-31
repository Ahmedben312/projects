<?php
include 'includes/functions.php';

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

// Get recent published posts
$posts = $post->getPosts(1, 20);

header('Content-Type: application/rss+xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Blog System</title>
    <link><?php echo (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST']; ?></link>
    <description>Latest blog posts from our system</description>
    <language>en-us</language>
    <atom:link href="<?php echo (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>" rel="self" type="application/rss+xml" />
    
    <?php while ($row = $posts->fetch(PDO::FETCH_ASSOC)): ?>
    <item>
        <title><?php echo htmlspecialchars($row['title']); ?></title>
        <link><?php echo (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/post.php?id=' . $row['id']; ?></link>
        <description><![CDATA[<?php echo htmlspecialchars($row['excerpt']); ?>]]></description>
        <pubDate><?php echo date('r', strtotime($row['created_at'])); ?></pubDate>
        <guid><?php echo (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/post.php?id=' . $row['id']; ?></guid>
        <author><?php echo htmlspecialchars($row['author_name']); ?></author>
        <category><?php echo htmlspecialchars($row['category_name']); ?></category>
    </item>
    <?php endwhile; ?>
</channel>
</rss>