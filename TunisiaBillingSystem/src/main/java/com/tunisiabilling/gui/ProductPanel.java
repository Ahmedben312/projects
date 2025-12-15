// ProductPanel.java
package com.tunisiabilling.gui;

import com.tunisiabilling.model.Product;
import com.tunisiabilling.service.BarcodeService;
import com.tunisiabilling.util.TunisianTaxUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.math.BigDecimal;

public class ProductPanel extends JPanel {
    private JTable productsTable;
    private DefaultTableModel tableModel;
    private JTextField barcodeField;
    private JTextField nameField;
    private JTextField priceField;
    private JComboBox<String> tvaComboBox;
    private JTextField descriptionField;
    private JTextField stockField;
    
    private BarcodeService barcodeService;
    
    public ProductPanel() {
        this.barcodeService = new BarcodeService();
        initializeUI();
        loadProductsToTable();
    }
    
    private void initializeUI() {
        setLayout(new BorderLayout(10, 10));
        
        // Form panel
        JPanel formPanel = createFormPanel();
        add(formPanel, BorderLayout.NORTH);
        
        // Table panel
        JPanel tablePanel = createTablePanel();
        add(tablePanel, BorderLayout.CENTER);
        
        // Button panel
        JPanel buttonPanel = createButtonPanel();
        add(buttonPanel, BorderLayout.SOUTH);
    }
    
    private JPanel createFormPanel() {
        JPanel panel = new JPanel(new GridLayout(6, 2, 5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Détails du Produit"));
        
        // Barcode
        panel.add(new JLabel("Code-barres*:"));
        barcodeField = new JTextField();
        panel.add(barcodeField);
        
        // Name
        panel.add(new JLabel("Nom*:"));
        nameField = new JTextField();
        panel.add(nameField);
        
        // Price
        panel.add(new JLabel("Prix (DT)*:"));
        priceField = new JTextField();
        panel.add(priceField);
        
        // TVA Rate
        panel.add(new JLabel("Taux TVA*:"));
        tvaComboBox = new JComboBox<>(new String[]{"19%", "7%", "0%"});
        panel.add(tvaComboBox);
        
        // Description
        panel.add(new JLabel("Description:"));
        descriptionField = new JTextField();
        panel.add(descriptionField);
        
        // Stock
        panel.add(new JLabel("Stock:"));
        stockField = new JTextField("0");
        panel.add(stockField);
        
        return panel;
    }
    
    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Produits Existants"));
        
        String[] columns = {"Code-barres", "Nom", "Prix", "TVA %", "Stock", "Description"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        
        productsTable = new JTable(tableModel);
        productsTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        productsTable.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                selectProductFromTable();
            }
        });
        
        JScrollPane scrollPane = new JScrollPane(productsTable);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createButtonPanel() {
        JPanel panel = new JPanel(new FlowLayout());
        
        JButton addButton = new JButton("Ajouter Produit");
        addButton.addActionListener(e -> addProduct());
        
        JButton updateButton = new JButton("Modifier Produit");
        updateButton.addActionListener(e -> updateProduct());
        
        JButton deleteButton = new JButton("Supprimer Produit");
        deleteButton.addActionListener(e -> deleteProduct());
        
        JButton clearButton = new JButton("Nouveau");
        clearButton.addActionListener(e -> clearForm());
        
        panel.add(addButton);
        panel.add(updateButton);
        panel.add(deleteButton);
        panel.add(clearButton);
        
        return panel;
    }
    
    private void loadProductsToTable() {
        tableModel.setRowCount(0);
        
        // In a real application, this would load from database
        // For now, we'll use the sample products from BarcodeService
        
        // Add some sample products to the table for demonstration
        addProductToTable("123456789012", "Produit 1", new BigDecimal("25.500"), new BigDecimal("19"), 100, "Exemple produit 1");
        addProductToTable("234567890123", "Produit 2", new BigDecimal("15.750"), new BigDecimal("7"), 50, "Exemple produit 2");
        addProductToTable("345678901234", "Produit 3", new BigDecimal("42.000"), new BigDecimal("19"), 25, "Exemple produit 3");
    }
    
    private void addProductToTable(String barcode, String name, BigDecimal price, BigDecimal tva, int stock, String description) {
        tableModel.addRow(new Object[]{
            barcode,
            name,
            price + " DT",
            tva + "%",
            stock,
            description
        });
    }
    
    private void addProduct() {
        try {
            // Validate inputs
            String barcode = barcodeField.getText().trim();
            String name = nameField.getText().trim();
            String priceText = priceField.getText().trim();
            
            if (barcode.isEmpty() || name.isEmpty() || priceText.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Veuillez remplir tous les champs obligatoires (*)");
                return;
            }
            
            if (!barcodeService.isValidBarcode(barcode)) {
                JOptionPane.showMessageDialog(this, "Code-barres invalide");
                return;
            }
            
            BigDecimal price = new BigDecimal(priceText);
            if (price.compareTo(BigDecimal.ZERO) < 0) {
                JOptionPane.showMessageDialog(this, "Le prix ne peut pas être négatif");
                return;
            }
            
            // Get TVA rate from combo box
            String tvaRateStr = (String) tvaComboBox.getSelectedItem();
            BigDecimal tvaRate = new BigDecimal(tvaRateStr.replace("%", ""));
            
            // Get stock
            int stock = 0;
            try {
                stock = Integer.parseInt(stockField.getText().trim());
            } catch (NumberFormatException e) {
                // Use default 0
            }
            
            String description = descriptionField.getText().trim();
            
            // Create product
            Product product = new Product(barcode, name, price, tvaRate);
            product.setDescription(description);
            product.setStockQuantity(stock);
            
            // Add to service
            barcodeService.addProduct(product);
            
            // Add to table
            addProductToTable(barcode, name, price, tvaRate, stock, description);
            
            JOptionPane.showMessageDialog(this, "Produit ajouté avec succès!");
            clearForm();
            
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Format de prix invalide");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Erreur: " + e.getMessage());
        }
    }
    
    private void updateProduct() {
        int selectedRow = productsTable.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner un produit à modifier");
            return;
        }
        
        // Implementation for updating product
        JOptionPane.showMessageDialog(this, "Fonction de modification - À implémenter");
    }
    
    private void deleteProduct() {
        int selectedRow = productsTable.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner un produit à supprimer");
            return;
        }
        
        int confirm = JOptionPane.showConfirmDialog(this,
            "Êtes-vous sûr de vouloir supprimer ce produit?",
            "Confirmation de suppression",
            JOptionPane.YES_NO_OPTION);
            
        if (confirm == JOptionPane.YES_OPTION) {
            tableModel.removeRow(selectedRow);
            JOptionPane.showMessageDialog(this, "Produit supprimé avec succès");
            clearForm();
        }
    }
    
    private void selectProductFromTable() {
        int selectedRow = productsTable.getSelectedRow();
        if (selectedRow >= 0) {
            String barcode = (String) tableModel.getValueAt(selectedRow, 0);
            String name = (String) tableModel.getValueAt(selectedRow, 1);
            String price = ((String) tableModel.getValueAt(selectedRow, 2)).replace(" DT", "");
            String tva = ((String) tableModel.getValueAt(selectedRow, 3)).replace("%", "");
            String stock = tableModel.getValueAt(selectedRow, 4).toString();
            String description = (String) tableModel.getValueAt(selectedRow, 5);
            
            barcodeField.setText(barcode);
            nameField.setText(name);
            priceField.setText(price);
            tvaComboBox.setSelectedItem(tva + "%");
            stockField.setText(stock);
            descriptionField.setText(description);
        }
    }
    
    private void clearForm() {
        barcodeField.setText("");
        nameField.setText("");
        priceField.setText("");
        tvaComboBox.setSelectedIndex(0);
        descriptionField.setText("");
        stockField.setText("0");
        productsTable.clearSelection();
        barcodeField.requestFocus();
    }
}