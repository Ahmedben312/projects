// InvoiceService.java
package com.tunisiabilling.service;

import com.tunisiabilling.model.Invoice;
import com.tunisiabilling.model.InvoiceItem;
import com.tunisiabilling.model.Product;
import com.tunisiabilling.util.TunisianTaxUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class InvoiceService {
    private List<Invoice> invoices;
    private FileService fileService;
    
    public InvoiceService() {
        this.invoices = new ArrayList<>();
        this.fileService = new FileService();
    }
    
    public Invoice createNewInvoice() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setIssueDate(LocalDateTime.now());
        invoice.setLegalMentions(TunisianTaxUtil.getLegalMentions());
        return invoice;
    }
    
    private String generateInvoiceNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        return "FACT-" + LocalDateTime.now().format(formatter);
    }
    
    public void addItemToInvoice(Invoice invoice, Product product, int quantity) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        // Check if product already exists in invoice
        Optional<InvoiceItem> existingItem = invoice.getItems().stream()
            .filter(item -> item.getProduct().getBarcode().equals(product.getBarcode()))
            .findFirst();
        
        if (existingItem.isPresent()) {
            // Update quantity of existing item
            InvoiceItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            // Add new item
            InvoiceItem newItem = new InvoiceItem(product, quantity);
            invoice.addItem(newItem);
        }
        
        invoice.calculateTotals();
    }
    
    public void removeItemFromInvoice(Invoice invoice, int itemIndex) {
        if (itemIndex >= 0 && itemIndex < invoice.getItems().size()) {
            invoice.getItems().remove(itemIndex);
            invoice.calculateTotals();
        }
    }
    
    public BigDecimal calculateTotalWithTVA(BigDecimal subtotal, BigDecimal tvaRate) {
        return subtotal.add(subtotal.multiply(tvaRate).divide(BigDecimal.valueOf(100)));
    }
    
    public void validateInvoice(Invoice invoice) throws IllegalArgumentException {
        if (invoice == null) {
            throw new IllegalArgumentException("Invoice cannot be null");
        }
        
        if (invoice.getItems() == null || invoice.getItems().isEmpty()) {
            throw new IllegalArgumentException("Invoice must contain at least one item");
        }
        
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Invoice number is required");
        }
        
        // Validate TVA rates
        for (InvoiceItem item : invoice.getItems()) {
            if (!TunisianTaxUtil.isValidTVARate(item.getTvaRate())) {
                throw new IllegalArgumentException("Invalid TVA rate: " + item.getTvaRate());
            }
        }
    }
    
    public List<Invoice> searchInvoicesByDate(LocalDateTime startDate, LocalDateTime endDate) {
        List<Invoice> result = new ArrayList<>();
        for (Invoice invoice : invoices) {
            if (!invoice.getIssueDate().isBefore(startDate) && 
                !invoice.getIssueDate().isAfter(endDate)) {
                result.add(invoice);
            }
        }
        return result;
    }
    
    public List<Invoice> getAllInvoices() {
        return new ArrayList<>(invoices);
    }
}