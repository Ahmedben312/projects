<?php
// utils/SimplePDFGenerator.php
require_once 'fpdf.php';

class SimplePDFGenerator {
    public function generatePropertyReport($property, $agent, $images) {
        $pdf = new FPDF();
        $pdf->AddPage();
        
        // Title
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, 'Property Report', 0, 1, 'C');
        $pdf->Ln(10);
        
        // Property Title
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, $property['title'], 0, 1);
        $pdf->Ln(5);
        
        // Property Details
        $pdf->SetFont('Arial', '', 12);
        
        $this->addDetailRow($pdf, 'Price:', '$' . number_format($property['price']));
        $this->addDetailRow($pdf, 'Type:', ucfirst($property['type']));
        $this->addDetailRow($pdf, 'Bedrooms:', $property['bedrooms']);
        $this->addDetailRow($pdf, 'Bathrooms:', $property['bathrooms']);
        $this->addDetailRow($pdf, 'Area:', $property['area'] . ' sq ft');
        $this->addDetailRow($pdf, 'Status:', ucfirst($property['status']));
        
        $pdf->Ln(5);
        
        // Address
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Address:', 0, 1);
        $pdf->SetFont('Arial', '', 12);
        $pdf->MultiCell(0, 8, $property['address'] . ', ' . $property['city'] . ', ' . $property['state'] . ' ' . $property['zip_code']);
        
        $pdf->Ln(5);
        
        // Description
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Description:', 0, 1);
        $pdf->SetFont('Arial', '', 12);
        $pdf->MultiCell(0, 8, $property['description']);
        
        $pdf->Ln(10);
        
        // Agent Information
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, 'Agent Information', 0, 1);
        $pdf->SetFont('Arial', '', 12);
        
        $this->addDetailRow($pdf, 'Name:', $agent['name']);
        $this->addDetailRow($pdf, 'Email:', $agent['email']);
        $this->addDetailRow($pdf, 'Phone:', $agent['phone'] ?: 'Not provided');
        
        $pdf->Ln(10);
        
        // Footer
        $pdf->SetFont('Arial', 'I', 10);
        $pdf->Cell(0, 10, 'Generated on: ' . date('F j, Y g:i A'), 0, 1, 'C');
        $pdf->Cell(0, 10, 'Real Estate Property Management System', 0, 1, 'C');
        
        // Return PDF as string
        return $pdf->Output('S');
    }
    
    private function addDetailRow($pdf, $label, $value) {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(40, 8, $label, 0, 0);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 8, $value, 0, 1);
    }
}