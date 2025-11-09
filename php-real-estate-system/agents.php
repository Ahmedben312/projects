<?php
require_once 'config/config.php';

$agents = $userModel->getAllAgents();

include 'includes/header.php';
?>

<div class="container py-5">
    <h2 class="text-center mb-5">Our Agents</h2>
    <div class="row">
        <?php if (!empty($agents)): ?>
            <?php foreach ($agents as $agent): ?>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="<?php echo htmlspecialchars($agent['avatar'] ?? 'assets/images/default-avatar.png'); ?>" class="card-img-top" alt="Agent <?php echo htmlspecialchars($agent['name']); ?>">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo htmlspecialchars($agent['name']); ?></h5>
                            <p class="card-text">Email: <?php echo htmlspecialchars($agent['email']); ?></p>
                            <p class="card-text">Phone: <?php echo htmlspecialchars($agent['phone']); ?></p>
                            <a href="agent-detail.php?id=<?php echo $agent['id']; ?>" class="btn btn-primary">View Profile</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12 text-center">
                <p class="text-muted">No agents found.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
