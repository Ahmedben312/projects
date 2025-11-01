-- E-Commerce Shop - Foreign Key Constraints
USE `ecommerce_shop`;

-- Add foreign keys after all tables are created
ALTER TABLE `products` 
ADD FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

ALTER TABLE `orders` 
ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `order_items` 
ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;

ALTER TABLE `cart` 
ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;