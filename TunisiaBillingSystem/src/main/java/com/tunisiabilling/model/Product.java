// Product.java
package com.tunisiabilling.model;

import java.math.BigDecimal;

public class Product {
    private String barcode;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal tvaRate; // TVA rate according to Tunisian law
    private int stockQuantity;
    
    // Constructors, getters, and setters
    public Product() {}
    
    public Product(String barcode, String name, BigDecimal price, BigDecimal tvaRate) {
        this.barcode = barcode;
        this.name = name;
        this.price = price;
        this.tvaRate = tvaRate;
    }
    
    // Getters and setters
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getTvaRate() { return tvaRate; }
    public void setTvaRate(BigDecimal tvaRate) { this.tvaRate = tvaRate; }
    
    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
}