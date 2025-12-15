// DirectoryCreator.java
package com.tunisiabilling.util;

import java.io.File;

public class DirectoryCreator {
    
    public static void createApplicationDirectories() {
        String[] directories = {
            "data",
            "data/invoices",
            "data/products", 
            "data/backups",
            "data/exports",
            "logs"
        };
        
        for (String dir : directories) {
            File directory = new File(dir);
            if (!directory.exists()) {
                if (directory.mkdirs()) {
                    System.out.println("Créé: " + dir);
                } else {
                    System.err.println("Erreur création: " + dir);
                }
            }
        }
    }
}