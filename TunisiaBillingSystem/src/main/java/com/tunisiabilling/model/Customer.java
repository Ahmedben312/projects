// Customer.java
package com.tunisiabilling.model;

public class Customer {
    private String id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String taxIdentificationNumber;
    
    public Customer() {}
    
    public Customer(String id, String name, String taxIdentificationNumber) {
        this.id = id;
        this.name = name;
        this.taxIdentificationNumber = taxIdentificationNumber;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTaxIdentificationNumber() { return taxIdentificationNumber; }
    public void setTaxIdentificationNumber(String taxIdentificationNumber) { 
        this.taxIdentificationNumber = taxIdentificationNumber; 
    }
    
    @Override
    public String toString() {
        return name + (taxIdentificationNumber != null ? " (NIF: " + taxIdentificationNumber + ")" : "");
    }
}