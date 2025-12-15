// AppConfig.java
package com.tunisiabilling.config;

import java.util.Locale;
import java.util.ResourceBundle;

public class AppConfig {
    private static final ResourceBundle BUNDLE = ResourceBundle.getBundle("application");
    
    public static final String APP_NAME = "Système de Facturation Tunisien";
    public static final String VERSION = "1.0.0";
    public static final Locale LOCALE = new Locale("fr", "TN");
    
    // File paths
    public static final String DATA_DIR = "data/";
    public static final String INVOICE_DIR = DATA_DIR + "invoices/";
    public static final String BACKUP_DIR = DATA_DIR + "backups/";
    public static final String EXPORT_DIR = DATA_DIR + "exports/";
    
    // Business configuration
    public static final String COMPANY_NAME = getProperty("company.name", "Votre Entreprise");
    public static final String COMPANY_ADDRESS = getProperty("company.address", "");
    public static final String COMPANY_PHONE = getProperty("company.phone", "");
    public static final String TAX_ID = getProperty("company.tax.id", "");
    
    private static String getProperty(String key, String defaultValue) {
        try {
            return BUNDLE.getString(key);
        } catch (Exception e) {
            return defaultValue;
        }
    }
    
    public static void initialize() {
        // Set application-wide locale
        Locale.setDefault(LOCALE);
        
        // Create necessary directories
        com.tunisiabilling.util.DirectoryCreator.createApplicationDirectories();
    }
}