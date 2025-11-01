-- E-Commerce Shop - Sample Products
USE `ecommerce_shop`;

INSERT IGNORE INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock_quantity`, `image_url`) VALUES
(1, 1, 'Wireless Headphones', 'High-quality Bluetooth headphones with noise cancellation', 89.99, 50, 'https://via.placeholder.com/300x300?text=Headphones'),
(2, 1, 'Smart Watch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 30, 'https://via.placeholder.com/300x300?text=Smart+Watch'),
(3, 2, 'Cotton T-Shirt', 'Comfortable cotton t-shirt available in multiple colors', 19.99, 100, 'https://via.placeholder.com/300x300?text=T-Shirt'),
(4, 2, 'Denim Jeans', 'Classic blue denim jeans', 49.99, 75, 'https://via.placeholder.com/300x300?text=Jeans'),
(5, 3, 'PHP Programming Book', 'Complete guide to PHP web development', 39.99, 20, 'https://via.placeholder.com/300x300?text=PHP+Book'),
(6, 4, 'Garden Tools Set', 'Complete set of essential garden tools', 79.99, 15, 'https://via.placeholder.com/300x300?text=Garden+Tools');