<?php
require_once '../config/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please login to add favorites']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $propertyId = $input['property_id'] ?? null;
    
    if (!$propertyId) {
        http_response_code(400);
        echo json_encode(['error' => 'Property ID is required']);
        exit;
    }
    
    $result = $favoriteModel->toggle($_SESSION['user_id'], $propertyId);
    
    echo json_encode(['status' => $result]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}