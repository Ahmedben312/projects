<?php
require_once '../config/config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $propertyId = $_POST['property_id'] ?? null;
    $agentId = $_POST['agent_id'] ?? null;
    $appointmentDate = $_POST['appointment_date'] ?? '';
    $message = $_POST['message'] ?? '';
    
    if (!$propertyId || !$agentId || !$appointmentDate) {
        $_SESSION['error'] = "Please fill all required fields";
        header("Location: ../property-detail.php?id=$propertyId");
        exit;
    }
    
    // Check if appointment time is available
    $existingAppointment = $appointmentModel->checkAvailability($agentId, $appointmentDate);
    if ($existingAppointment) {
        $_SESSION['error'] = "Selected time is not available. Please choose another time.";
        header("Location: ../property-detail.php?id=$propertyId");
        exit;
    }
    
    $appointmentModel->create([
        'user_id' => $_SESSION['user_id'],
        'property_id' => $propertyId,
        'agent_id' => $agentId,
        'appointment_date' => $appointmentDate,
        'message' => $message
    ]);
    
    $_SESSION['success'] = "Appointment scheduled successfully! The agent will contact you soon.";
    header("Location: ../property-detail.php?id=$propertyId");
    exit;
}

header('Location: ../properties.php');