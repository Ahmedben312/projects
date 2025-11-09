<?php
require_once 'config/config.php';

if (!isset($_GET['id'])) {
    header('Location: properties.php');
    exit;
}

$propertyId = (int)$_GET['id'];
$property = $propertyModel->findById($propertyId);

if (!$property) {
    header('Location: properties.php');
    exit;
}

$images = $propertyImageModel->getByProperty($propertyId);
$isFavorited = false;

if (isset($_SESSION['user_id'])) {
    $isFavorited = $favoriteModel->isFavorited($_SESSION['user_id'], $propertyId);
}

include 'includes/header.php';
?>

<div class="container py-5">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.php">Home</a></li>
            <li class="breadcrumb-item"><a href="properties.php">Properties</a></li>
            <li class="breadcrumb-item active"><?php echo htmlspecialchars($property['title']); ?></li>
        </ol>
    </nav>

    <div class="row">
        <!-- Property Images -->
        <div class="col-md-8">
            <div class="card mb-4">
                <div class="card-body">
                    <!-- Main Image -->
                    <?php if ($primaryImage): ?>
                        <a href="<?php echo BASE_URL . '/uploads/properties/' . $primaryImage['image_path']; ?>" 
                           data-lightbox="property-images" data-title="<?php echo htmlspecialchars($property['title']); ?>">
                            <img src="<?php echo BASE_URL . '/uploads/properties/' . $primaryImage['image_path']; ?>" 
                                 class="img-fluid rounded" alt="<?php echo htmlspecialchars($property['title']); ?>">
                        </a>
                    <?php else: ?>
                        <img src="https://via.placeholder.com/800x600" class="img-fluid rounded" alt="No image available">
                    <?php endif; ?>

                    <!-- Thumbnail Gallery -->
                    <?php if (count($otherImages) > 0): ?>
                    <div class="row mt-3">
                        <?php foreach ($otherImages as $image): ?>
                            <div class="col-3">
                                <a href="<?php echo BASE_URL . '/uploads/properties/' . $image['image_path']; ?>" 
                                   data-lightbox="property-images" data-title="<?php echo htmlspecialchars($property['title']); ?>">
                                    <img src="<?php echo BASE_URL . '/uploads/properties/' . $image['image_path']; ?>" 
                                         class="img-thumbnail" style="height: 100px; width: 100%; object-fit: cover;">
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Property Details -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="card-title mb-0">Property Details</h3>
                </div>
                <div class="card-body">
                    <h2 class="text-primary mb-3">$<?php echo number_format($property['price']); ?></h2>
                    <h4 class="mb-3"><?php echo htmlspecialchars($property['title']); ?></h4>
                    
                    <p class="text-muted mb-4">
                        <i class="fas fa-map-marker-alt"></i> 
                        <?php echo htmlspecialchars($property['address'] . ', ' . $property['city'] . ', ' . $property['state'] . ' ' . $property['zip_code']); ?>
                    </p>

                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="text-center p-3 border rounded">
                                <i class="fas fa-bed fa-2x text-primary mb-2"></i>
                                <h5><?php echo $property['bedrooms']; ?></h5>
                                <p class="text-muted mb-0">Bedrooms</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 border rounded">
                                <i class="fas fa-bath fa-2x text-primary mb-2"></i>
                                <h5><?php echo $property['bathrooms']; ?></h5>
                                <p class="text-muted mb-0">Bathrooms</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 border rounded">
                                <i class="fas fa-ruler-combined fa-2x text-primary mb-2"></i>
                                <h5><?php echo $property['area']; ?></h5>
                                <p class="text-muted mb-0">Sq Ft</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="text-center p-3 border rounded">
                                <i class="fas fa-home fa-2x text-primary mb-2"></i>
                                <h5><?php echo ucfirst($property['type']); ?></h5>
                                <p class="text-muted mb-0">Type</p>
                            </div>
                        </div>
                    </div>

                    <h5>Description</h5>
                    <p class="mb-4"><?php echo nl2br(htmlspecialchars($property['description'])); ?></p>

                    <!-- Google Map -->
                    <?php if ($property['latitude'] && $property['longitude']): ?>
                    <h5 class="mt-4">Location</h5>
                    <div id="map-<?php echo $property['id']; ?>" style="height: 300px; width: 100%;" 
                         data-lat="<?php echo $property['latitude']; ?>" 
                         data-lng="<?php echo $property['longitude']; ?>"></div>
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            const mapElement = document.getElementById('map-<?php echo $property['id']; ?>');
                            initMap(
                                mapElement.dataset.lat, 
                                mapElement.dataset.lng, 
                                <?php echo $property['id']; ?>
                            );
                        });
                    </script>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
            <!-- Action Buttons -->
            <div class="card mb-4">
                <div class="card-body">
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <button class="btn btn-outline-danger w-100 mb-2" 
                                onclick="toggleFavorite(<?php echo $property['id']; ?>)">
                            <i class="<?php echo $isFavorited ? 'fas' : 'far'; ?> fa-heart"></i>
                            <?php echo $isFavorited ? 'Remove from Favorites' : 'Add to Favorites'; ?>
                        </button>
                        
                        <button class="btn btn-primary w-100 mb-2" data-bs-toggle="modal" data-bs-target="#appointmentModal">
                            <i class="fas fa-calendar-alt"></i> Schedule Viewing
                        </button>
                        
                        <a href="actions/generate-pdf.php?property_id=<?php echo $property['id']; ?>" 
                           class="btn btn-outline-primary w-100" target="_blank">
                            <i class="fas fa-file-pdf"></i> Generate PDF Report
                        </a>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-primary w-100 mb-2">Login to Contact Agent</a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Agent Information -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">Listing Agent</h5>
                </div>
                <div class="card-body text-center">
                    <img src="<?php echo $property['agent_avatar'] ? BASE_URL . '/uploads/profiles/' . $property['agent_avatar'] : 'https://via.placeholder.com/100'; ?>" 
                         class="rounded-circle mb-3" width="100" height="100" alt="Agent">
                    <h5><?php echo htmlspecialchars($property['agent_name']); ?></h5>
                    <p class="text-muted">Real Estate Agent</p>
                    
                    <div class="contact-info">
                        <p><i class="fas fa-phone"></i> <?php echo htmlspecialchars($property['agent_phone']); ?></p>
                        <p><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($property['agent_email']); ?></p>
                    </div>
                    
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <button class="btn btn-outline-primary w-100 mt-2" data-bs-toggle="modal" data-bs-target="#messageModal">
                            <i class="fas fa-comment"></i> Send Message
                        </button>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Quick Facts -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Property Facts</h5>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled">
                        <li class="mb-2"><strong>Status:</strong> 
                            <span class="badge bg-<?php echo $property['status'] == 'available' ? 'success' : 'secondary'; ?>">
                                <?php echo ucfirst($property['status']); ?>
                            </span>
                        </li>
                        <li class="mb-2"><strong>Listed:</strong> 
                            <?php echo date('M j, Y', strtotime($property['created_at'])); ?>
                        </li>
                        <li class="mb-2"><strong>Property ID:</strong> #<?php echo $property['id']; ?></li>
                        <li class="mb-2"><strong>City:</strong> <?php echo htmlspecialchars($property['city']); ?></li>
                        <li class="mb-2"><strong>State:</strong> <?php echo htmlspecialchars($property['state']); ?></li>
                        <li class="mb-0"><strong>Zip Code:</strong> <?php echo htmlspecialchars($property['zip_code']); ?></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Appointment Modal -->
<?php if (isset($_SESSION['user_id'])): ?>
<div class="modal fade" id="appointmentModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Schedule Viewing Appointment</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="actions/schedule-appointment.php" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="property_id" value="<?php echo $property['id']; ?>">
                    <input type="hidden" name="agent_id" value="<?php echo $property['agent_id']; ?>">
                    
                    <div class="mb-3">
                        <label class="form-label">Preferred Date & Time</label>
                        <input type="datetime-local" name="appointment_date" class="form-control" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Message (Optional)</label>
                        <textarea name="message" class="form-control" rows="3" 
                                  placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Schedule Appointment</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Message Modal -->
<div class="modal fade" id="messageModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Send Message to Agent</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="actions/send-message.php" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="receiver_id" value="<?php echo $property['agent_id']; ?>">
                    <input type="hidden" name="property_id" value="<?php echo $property['id']; ?>">
                    
                    <div class="mb-3">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-control" rows="5" required 
                                  placeholder="Enter your message to the agent..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php endif; ?>

<?php include 'includes/footer.php'; ?>