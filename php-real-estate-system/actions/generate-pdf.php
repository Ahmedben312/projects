<?php
require_once '../config/config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}

$propertyId = $_GET['property_id'] ?? null;
if (!$propertyId) {
    header('Location: ../properties.php');
    exit;
}

$property = $propertyModel->findById($propertyId);
if (!$property) {
    header('Location: ../properties.php');
    exit;
}

$agent = $userModel->findById($property['agent_id']);

// Use SimplePDFGenerator
$pdfGenerator = new SimplePDFGenerator();
$pdfContent = $pdfGenerator->generatePropertyReport($property, $agent, []);

// Output PDF
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="property_report_' . $propertyId . '.pdf"');
header('Content-Length: ' . strlen($pdfContent));
echo $pdfContent;