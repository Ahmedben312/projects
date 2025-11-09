<?php
require_once 'config/config.php';

// Now all models are loaded via config.php, so we can use them directly
$userId = $_SESSION['user_id'] ?? null;
$featuredProperties = $propertyModel->getFeatured(6, $userId);

include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container text-center">
        <h1 class="display-4 mb-4">Find Your Dream Home</h1>
        <p class="lead mb-4">Discover the perfect property from our extensive collection</p>
        <a href="properties.php" class="btn btn-primary btn-lg">Browse Properties</a>
    </div>
</section>

<!-- Search Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="properties.php" method="GET" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" name="keyword" class="form-control" placeholder="Search by location, property...">
                    </div>
                    <div class="col-md-3">
                        <select name="type" class="form-select">
                            <option value="">All Types</option>
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select name="bedrooms" class="form-select">
                            <option value="">Any Bedrooms</option>
                            <option value="1">1+ Bedrooms</option>
                            <option value="2">2+ Bedrooms</option>
                            <option value="3">3+ Bedrooms</option>
                            <option value="4">4+ Bedrooms</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100">Search</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- Featured Properties -->
<section class="py-5">
    <div class="container">
        <h2 class="text-center mb-5">Featured Properties</h2>
        <div class="row">
            <?php if (!empty($featuredProperties)): ?>
                <?php foreach ($featuredProperties as $property): ?>
                    <?php include 'includes/property-card.php'; ?>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12 text-center">
                    <p class="text-muted">No featured properties found.</p>
                </div>
            <?php endif; ?>
        </div>
        <div class="text-center mt-4">
            <a href="properties.php" class="btn btn-outline-primary">View All Properties</a>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row text-center">
            <div class="col-md-4">
                <div class="feature-box p-4">
                    <i class="fas fa-search fa-3x text-primary mb-3"></i>
                    <h4>Advanced Search</h4>
                    <p>Find properties with our powerful search and filtering tools</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-box p-4">
                    <i class="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                    <h4>Location Maps</h4>
                    <p>View property locations with interactive Google Maps</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-box p-4">
                    <i class="fas fa-user-tie fa-3x text-primary mb-3"></i>
                    <h4>Expert Agents</h4>
                    <p>Connect with professional real estate agents</p>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>