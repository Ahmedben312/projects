// SecurityService.java
package com.tunisiabilling.service;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SecurityService {
    
    public String calculateFileHash(File file) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            try (InputStream is = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = is.read(buffer)) > 0) {
                    digest.update(buffer, 0, read);
                }
            }
            
            byte[] hash = digest.digest();
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IOException("SHA-256 algorithm not available", e);
        }
    }
    
    public void makeFileReadOnly(File file) throws IOException {
        if (!file.setReadOnly()) {
            throw new IOException("Failed to set file as read-only: " + file.getAbsolutePath());
        }
    }
    
    public boolean verifyFileIntegrity(File file, String expectedHash) throws IOException {
        try {
            String currentHash = calculateFileHash(file);
            return currentHash.equals(expectedHash);
        } catch (Exception e) {
            throw new IOException("Error verifying file integrity", e);
        }
    }
}