-- E-Commerce Shop - Test Users (Optional)
USE `ecommerce_shop`;

-- Test user: password is 'password123'
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `full_name`) VALUES
(1, 'testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User');