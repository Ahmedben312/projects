-- E-Commerce Shop Database Schema
CREATE DATABASE IF NOT EXISTS ecommerce_shop;
USE ecommerce_shop;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table (for persistent carts)
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100),
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and publications'),
('Home & Garden', 'Home improvement and garden supplies');

-- Insert sample products
INSERT INTO products (category_id, name, description, price, stock_quantity, image_url) VALUES
(1, 'Wireless Headphones', 'High-quality Bluetooth headphones with noise cancellation', 89.99, 50, 'https://via.placeholder.com/300x300?text=Headphones'),
(1, 'Smart Watch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 30, 'https://via.placeholder.com/300x300?text=Smart+Watch'),
(2, 'Cotton T-Shirt', 'Comfortable cotton t-shirt available in multiple colors', 19.99, 100, 'https://via.placeholder.com/300x300?text=T-Shirt'),
(2, 'Denim Jeans', 'Classic blue denim jeans', 49.99, 75, 'https://via.placeholder.com/300x300?text=Jeans'),
(3, 'PHP Programming Book', 'Complete guide to PHP web development', 39.99, 20, 'https://via.placeholder.com/300x300?text=PHP+Book'),
(4, 'Garden Tools Set', 'Complete set of essential garden tools', 79.99, 15, 'https://via.placeholder.com/300x300?text=Garden+Tools');