<?php
include '../includes/functions.php';
include '../includes/auth.php';
requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Handle category actions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        
        if ($action == 'create') {
            $name = sanitize($_POST['name']);
            $description = sanitize($_POST['description']);
            
            // Check if category already exists
            $check_query = "SELECT id FROM categories WHERE name = :name";
            $stmt = $db->prepare($check_query);
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $_SESSION['error'] = "Category '$name' already exists.";
            } else {
                $query = "INSERT INTO categories (name, description) VALUES (:name, :description)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':name', $name);
                $stmt->bindParam(':description', $description);
                
                if ($stmt->execute()) {
                    $_SESSION['success'] = "Category created successfully.";
                } else {
                    $_SESSION['error'] = "Failed to create category.";
                }
            }
        }
        elseif ($action == 'update') {
            $id = (int)$_POST['id'];
            $name = sanitize($_POST['name']);
            $description = sanitize($_POST['description']);
            
            $query = "UPDATE categories SET name = :name, description = :description WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                $_SESSION['success'] = "Category updated successfully.";
            } else {
                $_SESSION['error'] = "Failed to update category.";
            }
        }
        elseif ($action == 'delete') {
            $id = (int)$_POST['id'];
            
            // Check if category has posts
            $check_query = "SELECT COUNT(*) FROM posts WHERE category_id = :id";
            $stmt = $db->prepare($check_query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $post_count = $stmt->fetchColumn();
            
            if ($post_count > 0) {
                $_SESSION['error'] = "Cannot delete category with posts. Move or delete the posts first.";
            } else {
                $query = "DELETE FROM categories WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $id);
                
                if ($stmt->execute()) {
                    $_SESSION['success'] = "Category deleted successfully.";
                } else {
                    $_SESSION['error'] = "Failed to delete category.";
                }
            }
        }
        
        header('Location: categories.php');
        exit();
    }
}

// Get all categories with post counts
$categories_query = "SELECT c.*, COUNT(p.id) as post_count 
                    FROM categories c 
                    LEFT JOIN posts p ON c.id = p.category_id 
                    GROUP BY c.id 
                    ORDER BY c.name";
$categories = $db->query($categories_query)->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Categories - Admin Panel</title>
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
                    <h1 class="h2">Manage Categories</h1>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createCategoryModal">
                        <i class="fas fa-plus"></i> Add Category
                    </button>
                </div>

                <!-- Success/Error Messages -->
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
                <?php endif; ?>
                <?php if (isset($_SESSION['error'])): ?>
                    <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
                <?php endif; ?>

                <!-- Categories Table -->
                <div class="card">
                    <div class="card-body">
                        <?php if (empty($categories)): ?>
                            <div class="alert alert-info">
                                No categories found. <a href="#" data-bs-toggle="modal" data-bs-target="#createCategoryModal">Create the first category</a>.
                            </div>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Posts</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($categories as $category): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($category['name']); ?></td>
                                            <td><?php echo htmlspecialchars($category['description']); ?></td>
                                            <td>
                                                <span class="badge bg-primary"><?php echo $category['post_count']; ?></span>
                                            </td>
                                            <td><?php echo formatDate($category['created_at']); ?></td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-primary edit-category" 
                                                            data-bs-toggle="modal" 
                                                            data-bs-target="#editCategoryModal"
                                                            data-id="<?php echo $category['id']; ?>"
                                                            data-name="<?php echo htmlspecialchars($category['name']); ?>"
                                                            data-description="<?php echo htmlspecialchars($category['description']); ?>">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <form method="POST" class="d-inline">
                                                        <input type="hidden" name="id" value="<?php echo $category['id']; ?>">
                                                        <input type="hidden" name="action" value="delete">
                                                        <button type="submit" class="btn btn-outline-danger" 
                                                                onclick="return confirm('Are you sure you want to delete this category?')"
                                                                <?php echo $category['post_count'] > 0 ? 'disabled title="Category has posts"' : ''; ?>>
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

    <!-- Create Category Modal -->
    <div class="modal fade" id="createCategoryModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create New Category</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST">
                    <input type="hidden" name="action" value="create">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="form-label">Category Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Category Modal -->
    <div class="modal fade" id="editCategoryModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Category</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST">
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="id" id="edit_category_id">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="edit_name" class="form-label">Category Name</label>
                            <input type="text" class="form-control" id="edit_name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_description" class="form-label">Description</label>
                            <textarea class="form-control" id="edit_description" name="description" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Edit Category Modal
        document.addEventListener('DOMContentLoaded', function() {
            var editButtons = document.querySelectorAll('.edit-category');
            editButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var categoryId = this.getAttribute('data-id');
                    var categoryName = this.getAttribute('data-name');
                    var categoryDescription = this.getAttribute('data-description');
                    
                    document.getElementById('edit_category_id').value = categoryId;
                    document.getElementById('edit_name').value = categoryName;
                    document.getElementById('edit_description').value = categoryDescription;
                });
            });
        });
    </script>
</body>
</html>