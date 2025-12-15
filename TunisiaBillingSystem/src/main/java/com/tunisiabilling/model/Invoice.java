// Invoice.java
package com.tunisiabilling.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Invoice {
    private String invoiceNumber;
    private LocalDateTime issueDate;
    private Customer customer;
    private List<InvoiceItem> items;
    private BigDecimal subtotal;
    private BigDecimal totalTVA;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String legalMentions;
    
    public Invoice() {
        this.items = new ArrayList<>();
        this.subtotal = BigDecimal.ZERO;
        this.totalTVA = BigDecimal.ZERO;
        this.totalAmount = BigDecimal.ZERO;
        this.issueDate = LocalDateTime.now();
    }
    
    // Methods to calculate totals
    public void calculateTotals() {
        subtotal = BigDecimal.ZERO;
        totalTVA = BigDecimal.ZERO;
        
        for (InvoiceItem item : items) {
            subtotal = subtotal.add(item.getTotal());
            totalTVA = totalTVA.add(item.getTvaAmount());
        }
        
        totalAmount = subtotal.add(totalTVA);
    }
    
    public void addItem(InvoiceItem item) {
        items.add(item);
        calculateTotals();
    }
    
    // Getters and setters
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public LocalDateTime getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDateTime issueDate) { this.issueDate = issueDate; }
    
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    
    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getTotalTVA() { return totalTVA; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getLegalMentions() { return legalMentions; }
    public void setLegalMentions(String legalMentions) { this.legalMentions = legalMentions; }
}