<div class="col-md-4">
    <div class="card property-card">
        <div class="position-relative">
            <img src="<?php echo $property['image_path'] ? BASE_URL . '/uploads/properties/' . $property['image_path'] : 'https://via.placeholder.com/400x300'; ?>" 
                 class="card-img-top property-image" alt="<?php echo htmlspecialchars($property['title']); ?>">
            
            <?php if (isset($_SESSION['user_id'])): ?>
            <button class="favorite-btn" onclick="toggleFavorite(<?php echo $property['id']; ?>)" 
                    data-property="<?php echo $property['id']; ?>">
                <i class="<?php echo (isset($property['is_favorited']) && $property['is_favorited']) ? 'fas text-danger' : 'far'; ?> fa-heart"></i>
            </button>
            <?php endif; ?>
            
            <div class="position-absolute bottom-0 start-0">
                <span class="badge bg-primary m-2">$<?php echo number_format($property['price']); ?></span>
                <span class="badge bg-secondary m-2"><?php echo ucfirst($property['type']); ?></span>
            </div>
        </div>
        
        <div class="card-body">
            <h5 class="card-title"><?php echo htmlspecialchars($property['title']); ?></h5>
            <p class="card-text text-muted">
                <i class="fas fa-map-marker-alt"></i> 
                <?php echo htmlspecialchars($property['city'] . ', ' . $property['state']); ?>
            </p>
            <div class="property-features mb-3">
                <span class="me-3"><i class="fas fa-bed"></i> <?php echo $property['bedrooms']; ?> beds</span>
                <span class="me-3"><i class="fas fa-bath"></i> <?php echo $property['bathrooms']; ?> baths</span>
                <span><i class="fas fa-ruler-combined"></i> <?php echo $property['area']; ?> sq ft</span>
            </div>
            <p class="card-text"><?php echo substr($property['description'], 0, 100) . '...'; ?></p>
            
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Agent: <?php echo htmlspecialchars($property['agent_name']); ?></small>
                <a href="property-detail.php?id=<?php echo $property['id']; ?>" class="btn btn-primary btn-sm">
                    View Details
                </a>
            </div>
        </div>
    </div>
</div>