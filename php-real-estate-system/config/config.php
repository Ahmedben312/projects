<?php
// config/config.php

// Get the absolute path of the project root
define('ROOT_PATH', realpath(dirname(__FILE__) . '/..'));

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'real_estate_system');
define('DB_USER', 'root');
define('DB_PASS', '');

// Base URL for the application
define('BASE_URL', 'http://localhost:8080');

// Google Maps API Key
define('GOOGLE_MAPS_API_KEY', 'YOUR_API_KEY_HERE');

// File paths - using absolute paths
define('UPLOAD_PATH', ROOT_PATH . '/uploads/');
define('CACHE_PATH', ROOT_PATH . '/cache/');

// Start session
session_start();

// Include the Database class
require_once ROOT_PATH . '/classes/Database.php';

// Include all Model classes
require_once ROOT_PATH . '/models/User.php';
require_once ROOT_PATH . '/models/Property.php';
require_once ROOT_PATH . '/models/PropertyImage.php';
require_once ROOT_PATH . '/models/Favorite.php';
require_once ROOT_PATH . '/models/Appointment.php';
require_once ROOT_PATH . '/models/Message.php';

// Include Utility classes
require_once ROOT_PATH . '/utils/Cache.php';
require_once ROOT_PATH . '/utils/FileUpload.php';
require_once ROOT_PATH . '/utils/SimplePDFGenerator.php';
require_once ROOT_PATH . '/utils/fpdf.php';  // FPDF library

// Create a database connection
try {
    $db = new Database();
    
    // Initialize models
    $userModel = new User($db);
    $propertyModel = new Property($db);
    $favoriteModel = new Favorite($db);
    $appointmentModel = new Appointment($db);
    $propertyImageModel = new PropertyImage($db);
    
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}