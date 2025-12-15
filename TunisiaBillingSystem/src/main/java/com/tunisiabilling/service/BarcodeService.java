// Enhanced BarcodeService.java with additional methods
package com.tunisiabilling.service;

import com.tunisiabilling.model.Product;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class BarcodeService {
    private Map<String, Product> productDatabase;
    
    public BarcodeService() {
        this.productDatabase = new HashMap<>();
        initializeSampleProducts();
    }
    
    private void initializeSampleProducts() {
        // Enhanced sample products with more details
        productDatabase.put("123456789012", new Product("123456789012", "Lait Nido 400g", 
            new java.math.BigDecimal("8.500"), new java.math.BigDecimal("7")));
        productDatabase.put("234567890123", new Product("234567890123", "Huile Lesieur 1L", 
            new java.math.BigDecimal("12.750"), new java.math.BigDecimal("19")));
        productDatabase.put("345678901234", new Product("345678901234", "Sucre En Poudre 1kg", 
            new java.math.BigDecimal("3.200"), new java.math.BigDecimal("7")));
        productDatabase.put("456789012345", new Product("456789012345", "Café Café 250g", 
            new java.math.BigDecimal("15.900"), new java.math.BigDecimal("19")));
        productDatabase.put("567890123456", new Product("567890123456", "Thé Sultan 100g", 
            new java.math.BigDecimal("6.500"), new java.math.BigDecimal("19")));
    }
    
    public Product findProductByBarcode(String barcode) {
        return productDatabase.get(barcode);
    }
    
    public void addProduct(Product product) {
        productDatabase.put(product.getBarcode(), product);
    }
    
    public boolean isValidBarcode(String barcode) {
        if (barcode == null || barcode.trim().isEmpty()) {
            return false;
        }
        
        // Check if it's a valid EAN-13 format (12 or 13 digits)
        if (barcode.matches("\\d{12,13}")) {
            return true;
        }
        
        // Accept any numeric barcode for now
        return barcode.matches("\\d+");
    }
    
    public String readBarcodeFromImage(File imageFile) {
        try {
            BufferedImage bufferedImage = ImageIO.read(imageFile);
            if (bufferedImage == null) {
                throw new IOException("Impossible de lire l'image");
            }
            
            LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            
            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
            hints.put(DecodeHintType.POSSIBLE_FORMATS, 
                java.util.Arrays.asList(BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, 
                                      BarcodeFormat.UPC_A, BarcodeFormat.CODE_128));
            
            Result result = new MultiFormatReader().decode(bitmap, hints);
            return result.getText();
            
        } catch (NotFoundException e) {
            System.err.println("Aucun code-barres trouvé dans l'image");
            return null;
        } catch (Exception e) {
            System.err.println("Erreur lecture code-barres: " + e.getMessage());
            return null;
        }
    }
    
    public Map<String, Product> getAllProducts() {
        return new HashMap<>(productDatabase);
    }
    
    public boolean removeProduct(String barcode) {
        return productDatabase.remove(barcode) != null;
    }
    
    public void updateProduct(Product product) {
        if (productDatabase.containsKey(product.getBarcode())) {
            productDatabase.put(product.getBarcode(), product);
        }
    }
}