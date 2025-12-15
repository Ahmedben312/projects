// InvoiceItem.java
package com.tunisiabilling.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class InvoiceItem {
    private Product product;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal tvaRate;
    private BigDecimal total;
    private BigDecimal tvaAmount;
    
    public InvoiceItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = product.getPrice();
        this.tvaRate = product.getTvaRate();
        calculateTotals();
    }
    
    private void calculateTotals() {
        this.total = unitPrice.multiply(BigDecimal.valueOf(quantity));
        this.tvaAmount = total.multiply(tvaRate)
                             .divide(BigDecimal.valueOf(100), 3, RoundingMode.HALF_UP);
    }
    
    // Getters and setters
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { 
        this.quantity = quantity; 
        calculateTotals();
    }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice; 
        calculateTotals();
    }
    
    public BigDecimal getTvaRate() { return tvaRate; }
    public void setTvaRate(BigDecimal tvaRate) { 
        this.tvaRate = tvaRate; 
        calculateTotals();
    }
    
    public BigDecimal getTotal() { return total; }
    public BigDecimal getTvaAmount() { return tvaAmount; }
}