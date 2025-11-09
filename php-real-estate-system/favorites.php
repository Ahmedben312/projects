<?php
require_once 'config/config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$favorites = $favoriteModel->getUserFavorites($_SESSION['user_id']);

include 'includes/header.php';
?>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Favorite Properties</h2>
        <a href="properties.php" class="btn btn-outline-primary">Browse More Properties</a>
    </div>

    <?php if (empty($favorites)): ?>
        <div class="text-center py-5">
            <i class="fas fa-heart fa-5x text-muted mb-3"></i>
            <h3>No favorites yet</h3>
            <p class="text-muted">Start browsing properties and add them to your favorites!</p>
            <a href="properties.php" class="btn btn-primary">Browse Properties</a>
        </div>
    <?php else: ?>
        <div class="row">
            <?php 
            // Add favorite status for each property
            foreach ($favorites as &$property) {
                $property['is_favorited'] = true;
            }
            
            foreach ($favorites as $property): ?>
                <?php include 'includes/property-card.php'; ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>