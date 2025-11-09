<?php
require_once 'config/config.php';

// Models are already loaded via config.php
$filters = $_GET;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = 9;

$searchResult = $propertyModel->search($filters, $page, $perPage);

include 'includes/header.php';
?>

<div class="container py-5">
    <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Filters</h5>
                </div>
                <div class="card-body">
                    <form method="GET" id="filter-form">
                        <!-- Keyword Search -->
                        <div class="mb-3">
                            <label class="form-label">Search</label>
                            <input type="text" name="keyword" class="form-control" 
                                   value="<?php echo htmlspecialchars($filters['keyword'] ?? ''); ?>" 
                                   placeholder="Location, property...">
                        </div>

                        <!-- Property Type -->
                        <div class="mb-3">
                            <label class="form-label">Property Type</label>
                            <select name="type" class="form-select">
                                <option value="">All Types</option>
                                <option value="sale" <?php echo isset($filters['type']) && $filters['type'] == 'sale' ? 'selected' : ''; ?>>For Sale</option>
                                <option value="rent" <?php echo isset($filters['type']) && $filters['type'] == 'rent' ? 'selected' : ''; ?>>For Rent</option>
                            </select>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-3">
                            <label class="form-label">Price Range</label>
                            <div class="row">
                                <div class="col-6">
                                    <input type="number" name="min_price" class="form-control" 
                                           placeholder="Min" value="<?php echo $filters['min_price'] ?? ''; ?>">
                                </div>
                                <div class="col-6">
                                    <input type="number" name="max_price" class="form-control" 
                                           placeholder="Max" value="<?php echo $filters['max_price'] ?? ''; ?>">
                                </div>
                            </div>
                        </div>

                        <!-- Bedrooms -->
                        <div class="mb-3">
                            <label class="form-label">Bedrooms</label>
                            <select name="bedrooms" class="form-select">
                                <option value="">Any</option>
                                <option value="1" <?php echo isset($filters['bedrooms']) && $filters['bedrooms'] == '1' ? 'selected' : ''; ?>>1+</option>
                                <option value="2" <?php echo isset($filters['bedrooms']) && $filters['bedrooms'] == '2' ? 'selected' : ''; ?>>2+</option>
                                <option value="3" <?php echo isset($filters['bedrooms']) && $filters['bedrooms'] == '3' ? 'selected' : ''; ?>>3+</option>
                                <option value="4" <?php echo isset($filters['bedrooms']) && $filters['bedrooms'] == '4' ? 'selected' : ''; ?>>4+</option>
                            </select>
                        </div>

                        <!-- Bathrooms -->
                        <div class="mb-3">
                            <label class="form-label">Bathrooms</label>
                            <select name="bathrooms" class="form-select">
                                <option value="">Any</option>
                                <option value="1" <?php echo isset($filters['bathrooms']) && $filters['bathrooms'] == '1' ? 'selected' : ''; ?>>1+</option>
                                <option value="2" <?php echo isset($filters['bathrooms']) && $filters['bathrooms'] == '2' ? 'selected' : ''; ?>>2+</option>
                                <option value="3" <?php echo isset($filters['bathrooms']) && $filters['bathrooms'] == '3' ? 'selected' : ''; ?>>3+</option>
                            </select>
                        </div>

                        <!-- City -->
                        <div class="mb-3">
                            <label class="form-label">City</label>
                            <input type="text" name="city" class="form-control" 
                                   value="<?php echo htmlspecialchars($filters['city'] ?? ''); ?>">
                        </div>

                        <button type="submit" class="btn btn-primary w-100">Apply Filters</button>
                        <a href="properties.php" class="btn btn-outline-secondary w-100 mt-2">Reset</a>
                    </form>
                </div>
            </div>
        </div>

        <!-- Property Results -->
        <div class="col-md-9">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Properties</h2>
                <div class="text-muted">
                    Showing <?php echo count($searchResult['properties']); ?> of <?php echo $searchResult['total']; ?> properties
                </div>
            </div>

            <?php if (empty($searchResult['properties'])): ?>
                <div class="alert alert-info text-center">
                    <h4>No properties found</h4>
                    <p>Try adjusting your search criteria</p>
                </div>
            <?php else: ?>
                <div class="row">
                    <?php 
                    // Add favorite status for each property if user is logged in
                    if (isset($_SESSION['user_id'])) {
                        $favoriteModel = new Favorite($db);
                        foreach ($searchResult['properties'] as &$property) {
                            $property['is_favorited'] = $favoriteModel->isFavorited($_SESSION['user_id'], $property['id']);
                        }
                    }
                    
                    foreach ($searchResult['properties'] as $property): ?>
                        <?php include 'includes/property-card.php'; ?>
                    <?php endforeach; ?>
                </div>

                <!-- Pagination -->
                <?php if ($searchResult['totalPages'] > 1): ?>
                <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center">
                        <?php for ($i = 1; $i <= $searchResult['totalPages']; $i++): ?>
                            <li class="page-item <?php echo $i == $page ? 'active' : ''; ?>">
                                <a class="page-link" href="?<?php echo http_build_query(array_merge($_GET, ['page' => $i])); ?>">
                                    <?php echo $i; ?>
                                </a>
                            </li>
                        <?php endfor; ?>
                    </ul>
                </nav>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>