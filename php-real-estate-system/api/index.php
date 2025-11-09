<?php
require_once '../config/config.php';

header('Content-Type: application/json');

// Simple API Router
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = trim($_SERVER['PATH_INFO'] ?? '', '/');
$segments = explode('/', $path);

$endpoint = $segments[0] ?? '';
$id = $segments[1] ?? null;

// API Authentication Middleware
function authenticate() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
}

// Route handling with if-else (fixed version)
if ($requestMethod === 'POST' && $endpoint === 'auth/login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    $user = $userModel->findByEmail($email);
    
    if ($user && $userModel->verifyPassword($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} 
elseif ($requestMethod === 'POST' && $endpoint === 'auth/logout') {
    session_destroy();
    echo json_encode(['success' => true]);
} 
elseif ($requestMethod === 'GET' && $endpoint === 'properties') {
    $filters = $_GET;
    $page = $_GET['page'] ?? 1;
    $perPage = $_GET['per_page'] ?? 9;
    
    $result = $propertyModel->search($filters, $page, $perPage);
    echo json_encode($result);
} 
elseif ($requestMethod === 'GET' && $endpoint === 'properties' && $id) {
    authenticate();
    $property = $propertyModel->findById($id);
    
    if ($property) {
        echo json_encode($property);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Property not found']);
    }
} 
elseif ($requestMethod === 'GET' && $endpoint === 'favorites') {
    authenticate();
    $favorites = $favoriteModel->getUserFavorites($_SESSION['user_id']);
    echo json_encode($favorites);
} 
elseif ($requestMethod === 'POST' && $endpoint === 'favorites') {
    authenticate();
    $input = json_decode(file_get_contents('php://input'), true);
    $propertyId = $input['property_id'] ?? null;
    
    if (!$propertyId) {
        http_response_code(400);
        echo json_encode(['error' => 'Property ID required']);
        exit;
    }
    
    $result = $favoriteModel->toggle($_SESSION['user_id'], $propertyId);
    echo json_encode(['status' => $result]);
} 
elseif ($requestMethod === 'GET' && $endpoint === 'appointments') {
    authenticate();
    
    if ($_SESSION['user_role'] === 'agent') {
        $appointments = $appointmentModel->getByAgent($_SESSION['user_id']);
    } else {
        $appointments = $appointmentModel->getByUser($_SESSION['user_id']);
    }
    
    echo json_encode($appointments);
} 
elseif ($requestMethod === 'POST' && $endpoint === 'appointments') {
    authenticate();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $appointmentId = $appointmentModel->create(array_merge($input, ['user_id' => $_SESSION['user_id']]));
    echo json_encode(['success' => true, 'appointment_id' => $appointmentId]);
} 
else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}