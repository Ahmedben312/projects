<?php
require_once 'config/config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$user = $userModel->findById($_SESSION['user_id']);

if ($_SESSION['user_role'] === 'agent') {
    $appointments = $appointmentModel->getByAgent($_SESSION['user_id']);
    $properties = $propertyModel->getByAgent($_SESSION['user_id']);
} else {
    $appointments = $appointmentModel->getByUser($_SESSION['user_id']);
    $favorites = $favoriteModel->getUserFavorites($_SESSION['user_id']);
}

include 'includes/header.php';
?>

<div class="container py-5">
    <div class="row">
        <div class="col-md-3">
            <!-- User Profile Sidebar -->
            <div class="card">
                <div class="card-body text-center">
                    <img src="<?php echo $user['avatar'] ? BASE_URL . '/uploads/profiles/' . $user['avatar'] : 'https://via.placeholder.com/100'; ?>" 
                         class="rounded-circle mb-3" width="100" height="100" alt="Profile">
                    <h5><?php echo htmlspecialchars($user['name']); ?></h5>
                    <p class="text-muted"><?php echo ucfirst($user['role']); ?></p>
                    <p class="text-muted"><?php echo htmlspecialchars($user['email']); ?></p>
                    <?php if ($user['phone']): ?>
                        <p class="text-muted"><?php echo htmlspecialchars($user['phone']); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="col-md-9">
            <!-- Dashboard Content -->
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0">Dashboard</h4>
                </div>
                <div class="card-body">
                    <?php if ($_SESSION['user_role'] === 'agent'): ?>
                        <!-- Agent Dashboard -->
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="card bg-primary text-white">
                                    <div class="card-body">
                                        <h3><?php echo count($properties); ?></h3>
                                        <p>Listed Properties</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <h3><?php echo count($appointments); ?></h3>
                                        <p>Appointments</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-info text-white">
                                    <div class="card-body">
                                        <?php $rating = $userModel->getAgentRating($_SESSION['user_id']); ?>
                                        <h3><?php echo number_format($rating['avg_rating'] ?? 0, 1); ?></h3>
                                        <p>Average Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Agent's Properties -->
                        <h5 class="mb-3">My Properties</h5>
                        <div class="row">
                            <?php foreach ($properties as $property): ?>
                                <div class="col-md-6 mb-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6><?php echo htmlspecialchars($property['title']); ?></h6>
                                            <p class="text-muted">$<?php echo number_format($property['price']); ?> • <?php echo ucfirst($property['status']); ?></p>
                                            <a href="property-detail.php?id=<?php echo $property['id']; ?>" class="btn btn-sm btn-primary">View</a>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>

                    <?php else: ?>
                        <!-- Buyer Dashboard -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card bg-primary text-white">
                                    <div class="card-body">
                                        <h3><?php echo count($favorites); ?></h3>
                                        <p>Favorite Properties</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <h3><?php echo count($appointments); ?></h3>
                                        <p>Scheduled Viewings</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Favorite Properties -->
                        <h5 class="mb-3">Favorite Properties</h5>
                        <div class="row">
                            <?php if (empty($favorites)): ?>
                                <div class="col-12">
                                    <p class="text-muted">You haven't added any properties to favorites yet.</p>
                                    <a href="properties.php" class="btn btn-primary">Browse Properties</a>
                                </div>
                            <?php else: ?>
                                <?php foreach ($favorites as $property): ?>
                                    <div class="col-md-4 mb-3">
                                        <div class="card">
                                            <img src="<?php echo $property['image_path'] ? BASE_URL . '/uploads/properties/' . $property['image_path'] : 'https://via.placeholder.com/300x200'; ?>" 
                                                 class="card-img-top" style="height: 150px; object-fit: cover;">
                                            <div class="card-body">
                                                <h6><?php echo htmlspecialchars($property['title']); ?></h6>
                                                <p class="text-muted">$<?php echo number_format($property['price']); ?></p>
                                                <a href="property-detail.php?id=<?php echo $property['id']; ?>" class="btn btn-sm btn-primary">View Details</a>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Appointments Section -->
                    <h5 class="mt-5 mb-3">Recent Appointments</h5>
                    <?php if (empty($appointments)): ?>
                        <p class="text-muted">No appointments scheduled.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($appointments as $appointment): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($appointment['property_title']); ?></td>
                                            <td><?php echo date('M j, Y g:i A', strtotime($appointment['appointment_date'])); ?></td>
                                            <td>
                                                <span class="badge bg-<?php 
                                                    echo $appointment['status'] == 'confirmed' ? 'success' : 
                                                         ($appointment['status'] == 'pending' ? 'warning' : 'secondary');
                                                ?>">
                                                    <?php echo ucfirst($appointment['status']); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <?php if ($_SESSION['user_role'] === 'agent' && $appointment['status'] === 'pending'): ?>
                                                    <button class="btn btn-sm btn-success">Confirm</button>
                                                    <button class="btn btn-sm btn-danger">Cancel</button>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>