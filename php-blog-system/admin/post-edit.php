<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAuthor();

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);

// Get categories for dropdown
$categories = $db->query("SELECT * FROM categories ORDER BY name")->fetchAll();

// Check if editing existing post
$editing = false;
$post_data = null;

if (isset($_GET['id'])) {
    $post_id = (int)$_GET['id'];
    $post_data = $post->getPost($post_id);
    
    if ($post_data) {
        // Check if user is author or admin
        if (!isAdmin() && $post_data['author_id'] != $_SESSION['user_id']) {
            header('HTTP/1.0 403 Forbidden');
            echo 'Access denied. You can only edit your own posts.';
            exit();
        }
        $editing = true;
    } else {
        header('Location: posts.php');
        exit();
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = sanitize($_POST['title']);
    $content = sanitize($_POST['content']);
    $excerpt = sanitize($_POST['excerpt']);
    $category_id = (int)$_POST['category_id'];
    $status = sanitize($_POST['status']);
    
    $post->title = $title;
    $post->content = $content;
    $post->excerpt = $excerpt;
    $post->category_id = $category_id;
    $post->status = $status;
    
    if ($editing) {
        $post->id = $post_id;
        $post->author_id = $post_data['author_id']; // Keep original author
        
        // Handle featured image upload
        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
            try {
                $imageHandler = new ImageHandler();
                $image_result = $imageHandler->uploadImage($_FILES['featured_image']);
                $post->featured_image = $image_result['filename'];
                
                // Delete old image if exists
                if (!empty($post_data['featured_image'])) {
                    $imageHandler->deleteImage($post_data['featured_image']);
                }
            } catch (Exception $e) {
                $_SESSION['error'] = $e->getMessage();
            }
        } else {
            // Keep existing image if not uploading new one
            $post->featured_image = $post_data['featured_image'];
        }
        
        if ($post->update()) {
            $_SESSION['success'] = "Post updated successfully.";
        } else {
            $_SESSION['error'] = "Failed to update post.";
        }
    } else {
        // Creating new post
        $post->author_id = $_SESSION['user_id'];
        
        // Handle featured image upload
        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
            try {
                $imageHandler = new ImageHandler();
                $image_result = $imageHandler->uploadImage($_FILES['featured_image']);
                $post->featured_image = $image_result['filename'];
            } catch (Exception $e) {
                $_SESSION['error'] = $e->getMessage();
            }
        }
        
        if ($post_id = $post->create()) {
            $_SESSION['success'] = "Post created successfully.";
        } else {
            $_SESSION['error'] = "Failed to create post.";
        }
    }
    
    header('Location: posts.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $editing ? 'Edit Post' : 'Create Post'; ?> - Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .form-control, .form-select { margin-bottom: 1rem; }
        .image-preview { max-width: 300px; max-height: 200px; }
    </style>
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
                    <h1 class="h2"><?php echo $editing ? 'Edit Post' : 'Create New Post'; ?></h1>
                    <a href="posts.php" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left"></i> Back to Posts
                    </a>
                </div>

                <!-- Success/Error Messages -->
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
                <?php endif; ?>
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
                <?php endif; ?>

                <!-- Post Form -->
                <div class="card">
                    <div class="card-body">
                        <form method="POST" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-md-8">
                                    <!-- Title -->
                                    <div class="mb-3">
                                        <label for="title" class="form-label">Post Title *</label>
                                        <input type="text" class="form-control" id="title" name="title" 
                                               value="<?php echo $post_data['title'] ?? ''; ?>" required
                                               placeholder="Enter post title">
                                    </div>
                                    
                                    <!-- Content -->
                                    <div class="mb-3">
                                        <label for="content" class="form-label">Content *</label>
                                        <textarea class="form-control" id="content" name="content" rows="15" required
                                                  placeholder="Write your post content here..."><?php echo $post_data['content'] ?? ''; ?></textarea>
                                    </div>
                                    
                                    <!-- Excerpt -->
                                    <div class="mb-3">
                                        <label for="excerpt" class="form-label">Excerpt</label>
                                        <textarea class="form-control" id="excerpt" name="excerpt" rows="4"
                                                  placeholder="Brief summary of your post (optional)"><?php echo $post_data['excerpt'] ?? ''; ?></textarea>
                                        <div class="form-text">A short summary that will appear on the blog listing page.</div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4">
                                    <!-- Publish Settings -->
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Publish</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="status" class="form-label">Status</label>
                                                <select class="form-select" id="status" name="status" required>
                                                    <option value="draft" <?php echo (isset($post_data['status']) && $post_data['status'] == 'draft') ? 'selected' : ''; ?>>Draft</option>
                                                    <option value="published" <?php echo (isset($post_data['status']) && $post_data['status'] == 'published') ? 'selected' : ''; ?>>Published</option>
                                                </select>
                                            </div>
                                            
                                            <?php if ($editing): ?>
                                            <div class="mb-3">
                                                <label class="form-label">Created</label>
                                                <p class="form-control-plaintext"><?php echo formatDate($post_data['created_at']); ?></p>
                                            </div>
                                            <?php if ($post_data['updated_at'] != $post_data['created_at']): ?>
                                            <div class="mb-3">
                                                <label class="form-label">Last Updated</label>
                                                <p class="form-control-plaintext"><?php echo formatDate($post_data['updated_at']); ?></p>
                                            </div>
                                            <?php endif; ?>
                                            <?php endif; ?>
                                            
                                            <div class="d-grid gap-2">
                                                <button type="submit" class="btn btn-primary">
                                                    <?php echo $editing ? 'Update Post' : 'Publish Post'; ?>
                                                </button>
                                                <a href="posts.php" class="btn btn-outline-secondary">Cancel</a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Categories -->
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Categories</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="category_id" class="form-label">Category *</label>
                                                <select class="form-select" id="category_id" name="category_id" required>
                                                    <option value="">Select a category</option>
                                                    <?php foreach ($categories as $category): ?>
                                                    <option value="<?php echo $category['id']; ?>" 
                                                        <?php echo (isset($post_data['category_id']) && $post_data['category_id'] == $category['id']) ? 'selected' : ''; ?>>
                                                        <?php echo htmlspecialchars($category['name']); ?>
                                                    </option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Featured Image -->
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Featured Image</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="featured_image" class="form-label">Upload Image</label>
                                                <input type="file" class="form-control" id="featured_image" name="featured_image" accept="image/*">
                                                
                                                <?php if ($editing && $post_data['featured_image']): ?>
                                                <div class="mt-3">
                                                    <p class="mb-2"><strong>Current Image:</strong></p>
                                                    <img src="../uploads/images/<?php echo $post_data['featured_image']; ?>" 
                                                         alt="Current featured image" 
                                                         class="img-thumbnail image-preview">
                                                    <div class="form-text mt-2">
                                                        Upload a new image to replace the current one.
                                                    </div>
                                                </div>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Image preview
        document.getElementById('featured_image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Remove existing preview
                    const existingPreview = document.querySelector('.image-preview');
                    if (existingPreview && existingPreview.parentNode) {
                        existingPreview.parentNode.removeChild(existingPreview);
                    }
                    
                    // Create new preview
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'img-thumbnail image-preview mt-2';
                    img.style.maxWidth = '300px';
                    img.style.maxHeight = '200px';
                    
                    // Insert after file input
                    const fileInput = document.getElementById('featured_image');
                    fileInput.parentNode.appendChild(img);
                }
                reader.readAsDataURL(file);
            }
        });

        // Character count for excerpt
        const excerptTextarea = document.getElementById('excerpt');
        if (excerptTextarea) {
            const charCount = document.createElement('div');
            charCount.className = 'form-text text-end';
            charCount.textContent = '0/300 characters';
            excerptTextarea.parentNode.appendChild(charCount);

            excerptTextarea.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = `${length}/300 characters`;
                if (length > 300) {
                    charCount.classList.add('text-danger');
                } else {
                    charCount.classList.remove('text-danger');
                }
            });

            // Initialize count
            charCount.textContent = `${excerptTextarea.value.length}/300 characters`;
        }
    </script>
</body>
</html>