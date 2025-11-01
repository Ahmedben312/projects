-- E-Commerce Shop - Performance Indexes
USE `ecommerce_shop`;

-- Indexes for better performance
CREATE INDEX `idx_users_email` ON `users`(`email`);
CREATE INDEX `idx_users_username` ON `users`(`username`);
CREATE INDEX `idx_products_category` ON `products`(`category_id`);
CREATE INDEX `idx_products_name` ON `products`(`name`);
CREATE INDEX `idx_orders_user` ON `orders`(`user_id`);
CREATE INDEX `idx_orders_status` ON `orders`(`status`);
CREATE INDEX `idx_order_items_order` ON `order_items`(`order_id`);
CREATE INDEX `idx_order_items_product` ON `order_items`(`product_id`);
CREATE INDEX `idx_cart_user` ON `cart`(`user_id`);
CREATE INDEX `idx_cart_session` ON `cart`(`session_id`);
CREATE INDEX `idx_cart_product` ON `cart`(`product_id`);