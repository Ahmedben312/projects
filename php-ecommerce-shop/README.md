# E-Commerce Shop

A complete PHP e-commerce application with user authentication, shopping cart, and order management.

## Features

- User registration and login
- Product catalog with categories
- Shopping cart functionality
- Checkout process
- Order management
- User profile management
- Responsive design

## Installation

1. Clone or download this project to your web server
2. Create a MySQL database named `ecommerce_shop`
3. Import the `sql/database.sql` file
4. Configure database settings in `includes/config.php`
5. Set up your web server to point to the `public` directory

## Database Configuration

Update the database credentials in `includes/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'ecommerce_shop');
```
