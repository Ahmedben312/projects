-- E-Commerce Shop - Table Structure
CREATE DATABASE IF NOT EXISTS `ecommerce_shop` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecommerce_shop`;

-- Users table
CREATE TABLE `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `address` TEXT,
    `city` VARCHAR(50),
    `postal_code` VARCHAR(10),
    `country` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE `categories` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Products table
CREATE TABLE `products` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `stock_quantity` INT DEFAULT 0,
    `image_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE `orders` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    `payment_method` VARCHAR(50),
    `payment_status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    `shipping_address` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Order items table
CREATE TABLE `order_items` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

-- Cart table
CREATE TABLE `cart` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `session_id` VARCHAR(100),
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;