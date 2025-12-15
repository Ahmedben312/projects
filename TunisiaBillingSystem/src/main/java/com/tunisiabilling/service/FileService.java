// FileService.java
package com.tunisiabilling.service;

import com.tunisiabilling.model.Invoice;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.*;
import java.nio.file.*;
import java.time.format.DateTimeFormatter;

public class FileService {
    private static final String INVOICE_DIR = "data/invoices/";
    private static final String PRODUCT_DIR = "data/products/";
    private static final String BACKUP_DIR = "data/backups/";
    
    private ObjectMapper objectMapper;
    private SecurityService securityService;
    
    public FileService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.securityService = new SecurityService();
        
        createDirectories();
    }
    
    private void createDirectories() {
        try {
            new File(INVOICE_DIR).mkdirs();
            new File(PRODUCT_DIR).mkdirs();
            new File(BACKUP_DIR).mkdirs();
        } catch (Exception e) {
            System.err.println("Error creating directories: " + e.getMessage());
        }
    }
    
    public void saveInvoice(Invoice invoice) throws IOException {
        String fileName = INVOICE_DIR + "facture_" + invoice.getInvoiceNumber() + ".json";
        File invoiceFile = new File(fileName);
        
        try {
            // Serialize invoice to JSON
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(invoiceFile, invoice);
            
            // Make file read-only and calculate hash
            securityService.makeFileReadOnly(invoiceFile);
            String fileHash = securityService.calculateFileHash(invoiceFile);
            
            // Save hash for verification
            saveFileHash(invoiceFile, fileHash);
            
            // Create backup
            createBackup(invoiceFile);
            
        } catch (Exception e) {
            throw new IOException("Failed to save invoice: " + e.getMessage(), e);
        }
    }
    
    private void saveFileHash(File file, String hash) throws IOException {
        File hashFile = new File(file.getAbsolutePath() + ".hash");
        try (PrintWriter writer = new PrintWriter(hashFile)) {
            writer.print(hash);
        }
        securityService.makeFileReadOnly(hashFile);
    }
    
    private void createBackup(File originalFile) throws IOException {
        try {
            String backupFileName = BACKUP_DIR + originalFile.getName() + ".backup";
            Files.copy(originalFile.toPath(), Paths.get(backupFileName), 
                      StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            System.err.println("Backup failed: " + e.getMessage());
            // Don't throw exception for backup failure
        }
    }
    
    public Invoice loadInvoice(String invoiceNumber) throws IOException {
        String fileName = INVOICE_DIR + "facture_" + invoiceNumber + ".json";
        File invoiceFile = new File(fileName);
        
        if (!invoiceFile.exists()) {
            throw new FileNotFoundException("Facture non trouvée: " + invoiceNumber);
        }
        
        try {
            // Verify file integrity
            verifyInvoiceIntegrity(invoiceFile);
            
            return objectMapper.readValue(invoiceFile, Invoice.class);
        } catch (Exception e) {
            throw new IOException("Error loading invoice: " + e.getMessage(), e);
        }
    }
    
    private void verifyInvoiceIntegrity(File invoiceFile) throws IOException {
        try {
            File hashFile = new File(invoiceFile.getAbsolutePath() + ".hash");
            if (!hashFile.exists()) {
                throw new SecurityException("Fichier de hash manquant pour: " + invoiceFile.getName());
            }
            
            String savedHash = new String(Files.readAllBytes(hashFile.toPath()));
            if (!securityService.verifyFileIntegrity(invoiceFile, savedHash.trim())) {
                throw new SecurityException("Intégrité du fichier compromise: " + invoiceFile.getName());
            }
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new IOException("Erreur de vérification d'intégrité", e);
        }
    }
    
    // Additional utility methods
    public boolean invoiceExists(String invoiceNumber) {
        String fileName = INVOICE_DIR + "facture_" + invoiceNumber + ".json";
        return new File(fileName).exists();
    }
    
    public String[] listAllInvoices() {
        File invoiceDir = new File(INVOICE_DIR);
        File[] invoiceFiles = invoiceDir.listFiles((dir, name) -> name.endsWith(".json"));
        if (invoiceFiles == null) {
            return new String[0];
        }
        
        String[] invoiceNumbers = new String[invoiceFiles.length];
        for (int i = 0; i < invoiceFiles.length; i++) {
            String name = invoiceFiles[i].getName();
            invoiceNumbers[i] = name.replace("facture_", "").replace(".json", "");
        }
        return invoiceNumbers;
    }
}