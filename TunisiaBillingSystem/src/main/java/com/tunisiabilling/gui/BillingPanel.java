// BillingPanel.java
package com.tunisiabilling.gui;

import com.tunisiabilling.model.*;
import com.tunisiabilling.service.BarcodeService;
import com.tunisiabilling.service.FileService;
import com.tunisiabilling.util.TunisianTaxUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BillingPanel extends JPanel {
    private JTextField barcodeField;
    private JTextField quantityField;
    private JTable itemsTable;
    private DefaultTableModel tableModel;
    private JLabel totalLabel;
    private JLabel tvaLabel;
    private JLabel subtotalLabel;
    
    private Invoice currentInvoice;
    private BarcodeService barcodeService;
    private FileService fileService;
    
    public BillingPanel() {
        this.barcodeService = new BarcodeService();
        this.fileService = new FileService();
        this.currentInvoice = new Invoice();
        
        initializeUI();
    }
    
    private void initializeUI() {
        setLayout(new BorderLayout(10, 10));
        
        // Input panel
        JPanel inputPanel = createInputPanel();
        add(inputPanel, BorderLayout.NORTH);
        
        // Table panel
        JPanel tablePanel = createTablePanel();
        add(tablePanel, BorderLayout.CENTER);
        
        // Summary panel
        JPanel summaryPanel = createSummaryPanel();
        add(summaryPanel, BorderLayout.SOUTH);
        
        // Control panel
        JPanel controlPanel = createControlPanel();
        add(controlPanel, BorderLayout.EAST);
    }
    
    private JPanel createInputPanel() {
        JPanel panel = new JPanel(new GridLayout(2, 2, 5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Saisie Produit"));
        
        panel.add(new JLabel("Code-barres:"));
        barcodeField = new JTextField();
        barcodeField.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    addProductByBarcode();
                }
            }
        });
        panel.add(barcodeField);
        
        panel.add(new JLabel("Quantité:"));
        quantityField = new JTextField("1");
        panel.add(quantityField);
        
        return panel;
    }
    
    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Articles de la Facture"));
        
        String[] columns = {"Code-barres", "Produit", "Prix Unitaire", "Quantité", "TVA %", "Total"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        
        itemsTable = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(itemsTable);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createSummaryPanel() {
        JPanel panel = new JPanel(new GridLayout(3, 2, 5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Résumé"));
        
        panel.add(new JLabel("Sous-total:"));
        subtotalLabel = new JLabel("0.000 DT");
        panel.add(subtotalLabel);
        
        panel.add(new JLabel("TVA:"));
        tvaLabel = new JLabel("0.000 DT");
        panel.add(tvaLabel);
        
        panel.add(new JLabel("Total:"));
        totalLabel = new JLabel("0.000 DT");
        panel.add(totalLabel);
        
        return panel;
    }
    
    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new GridLayout(5, 1, 5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Actions"));
        
        JButton addButton = new JButton("Ajouter Produit");
        addButton.addActionListener(e -> addProductByBarcode());
        
        JButton removeButton = new JButton("Supprimer Article");
        removeButton.addActionListener(e -> removeSelectedItem());
        
        JButton clearButton = new JButton("Nouvelle Facture");
        clearButton.addActionListener(e -> clearInvoice());
        
        JButton saveButton = new JButton("Enregistrer Facture");
        saveButton.addActionListener(e -> saveInvoice());
        
        JButton printButton = new JButton("Imprimer");
        printButton.addActionListener(e -> printInvoice());
        
        panel.add(addButton);
        panel.add(removeButton);
        panel.add(clearButton);
        panel.add(saveButton);
        panel.add(printButton);
        
        return panel;
    }
    
    private void addProductByBarcode() {
        String barcode = barcodeField.getText().trim();
        String quantityText = quantityField.getText().trim();
        
        if (barcode.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Veuillez saisir un code-barres");
            return;
        }
        
        if (!barcodeService.isValidBarcode(barcode)) {
            JOptionPane.showMessageDialog(this, "Code-barres invalide");
            return;
        }
        
        Product product = barcodeService.findProductByBarcode(barcode);
        if (product == null) {
            JOptionPane.showMessageDialog(this, "Produit non trouvé: " + barcode);
            return;
        }
        
        int quantity;
        try {
            quantity = Integer.parseInt(quantityText);
            if (quantity <= 0) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Quantité invalide");
            return;
        }
        
        // Add to invoice
        InvoiceItem item = new InvoiceItem(product, quantity);
        currentInvoice.addItem(item);
        
        // Update table
        updateInvoiceTable();
        
        // Clear fields
        barcodeField.setText("");
        barcodeField.requestFocus();
    }
    
    private void updateInvoiceTable() {
        tableModel.setRowCount(0);
        
        for (InvoiceItem item : currentInvoice.getItems()) {
            Product product = item.getProduct();
            Object[] row = {
                product.getBarcode(),
                product.getName(),
                product.getPrice() + " DT",
                item.getQuantity(),
                item.getTvaRate() + "%",
                item.getTotal() + " DT"
            };
            tableModel.addRow(row);
        }
        
        // Update summary
        subtotalLabel.setText(currentInvoice.getSubtotal() + " DT");
        tvaLabel.setText(currentInvoice.getTotalTVA() + " DT");
        totalLabel.setText(currentInvoice.getTotalAmount() + " DT");
    }
    
    private void removeSelectedItem() {
        int selectedRow = itemsTable.getSelectedRow();
        if (selectedRow >= 0) {
            currentInvoice.getItems().remove(selectedRow);
            currentInvoice.calculateTotals();
            updateInvoiceTable();
        } else {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner un article à supprimer");
        }
    }
    
    private void clearInvoice() {
        currentInvoice = new Invoice();
        tableModel.setRowCount(0);
        updateInvoiceTable();
        JOptionPane.showMessageDialog(this, "Nouvelle facture créée");
    }
    
    private void saveInvoice() {
        if (currentInvoice.getItems().isEmpty()) {
            JOptionPane.showMessageDialog(this, "Impossible d'enregistrer une facture vide");
            return;
        }
        
        // Generate invoice number
        String invoiceNumber = generateInvoiceNumber();
        currentInvoice.setInvoiceNumber(invoiceNumber);
        currentInvoice.setLegalMentions(TunisianTaxUtil.getLegalMentions());
        
        try {
            fileService.saveInvoice(currentInvoice);
            JOptionPane.showMessageDialog(this, 
                "Facture enregistrée avec succès!\nNuméro: " + invoiceNumber);
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, 
                "Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }
    
    private String generateInvoiceNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return "FACT-" + LocalDateTime.now().format(formatter);
    }
    
    private void printInvoice() {
        // Basic printing functionality
        JOptionPane.showMessageDialog(this, 
            "Fonction d'impression - À implémenter avec une bibliothèque d'impression");
    }
}