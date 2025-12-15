// ReportsPanel.java
package com.tunisiabilling.gui;

import com.tunisiabilling.model.Invoice;
import com.tunisiabilling.service.FileService;
import com.tunisiabilling.util.DateUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReportsPanel extends JPanel {
    private JTable reportsTable;
    private DefaultTableModel tableModel;
    private JSpinner startDateSpinner;
    private JSpinner endDateSpinner;
    private JLabel totalSalesLabel;
    private JLabel totalTVALabel;
    private JLabel invoiceCountLabel;
    
    private FileService fileService;
    private List<Invoice> loadedInvoices;
    
    public ReportsPanel() {
        this.fileService = new FileService();
        this.loadedInvoices = new ArrayList<>();
        initializeUI();
    }
    
    private void initializeUI() {
        setLayout(new BorderLayout(10, 10));
        
        // Filter panel
        JPanel filterPanel = createFilterPanel();
        add(filterPanel, BorderLayout.NORTH);
        
        // Table panel
        JPanel tablePanel = createTablePanel();
        add(tablePanel, BorderLayout.CENTER);
        
        // Summary panel
        JPanel summaryPanel = createSummaryPanel();
        add(summaryPanel, BorderLayout.SOUTH);
    }
    
    private JPanel createFilterPanel() {
        JPanel panel = new JPanel(new FlowLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Filtres de Rapport"));
        
        panel.add(new JLabel("Du:"));
        startDateSpinner = createDatePicker();
        panel.add(startDateSpinner);
        
        panel.add(new JLabel("Au:"));
        endDateSpinner = createDatePicker();
        panel.add(endDateSpinner);
        
        JButton searchButton = new JButton("Rechercher");
        searchButton.addActionListener(e -> searchInvoices());
        panel.add(searchButton);
        
        JButton exportButton = new JButton("Exporter CSV");
        exportButton.addActionListener(e -> exportToCSV());
        panel.add(exportButton);
        
        JButton refreshButton = new JButton("Actualiser");
        refreshButton.addActionListener(e -> refreshData());
        panel.add(refreshButton);
        
        return panel;
    }
    
    private JSpinner createDatePicker() {
        SpinnerDateModel model = new SpinnerDateModel();
        JSpinner spinner = new JSpinner(model);
        JSpinner.DateEditor editor = new JSpinner.DateEditor(spinner, "dd/MM/yyyy");
        spinner.setEditor(editor);
        spinner.setValue(java.util.Calendar.getInstance().getTime());
        return spinner;
    }
    
    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Factures"));
        
        String[] columns = {"N° Facture", "Date", "Client", "Sous-total", "TVA", "Total", "Méthode Paiement"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        
        reportsTable = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(reportsTable);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createSummaryPanel() {
        JPanel panel = new JPanel(new GridLayout(2, 3, 10, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Résumé"));
        
        panel.add(new JLabel("Total des Ventes:"));
        totalSalesLabel = new JLabel("0.000 DT");
        panel.add(totalSalesLabel);
        
        panel.add(new JLabel("Total TVA:"));
        totalTVALabel = new JLabel("0.000 DT");
        panel.add(totalTVALabel);
        
        panel.add(new JLabel("Nombre de Factures:"));
        invoiceCountLabel = new JLabel("0");
        panel.add(invoiceCountLabel);
        
        return panel;
    }
    
    private void searchInvoices() {
        try {
            // For demonstration, we'll create sample data
            // In real application, this would load from file system or database
            createSampleInvoices();
            
            // Update table
            updateReportsTable();
            
            // Update summary
            updateSummary();
            
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Erreur lors de la recherche: " + e.getMessage());
        }
    }
    
    private void createSampleInvoices() {
        loadedInvoices.clear();
        
        // Create sample invoices for demonstration
        // In real application, these would be loaded from files
        try {
            File invoiceDir = new File("data/invoices/");
            if (invoiceDir.exists() && invoiceDir.isDirectory()) {
                File[] invoiceFiles = invoiceDir.listFiles((dir, name) -> name.endsWith(".json"));
                if (invoiceFiles != null) {
                    for (File file : invoiceFiles) {
                        try {
                            Invoice invoice = fileService.loadInvoice(
                                file.getName().replace("facture_", "").replace(".json", ""));
                            loadedInvoices.add(invoice);
                        } catch (Exception e) {
                            System.err.println("Erreur chargement facture: " + file.getName());
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Fallback to sample data if no files exist
            createFallbackSampleData();
        }
        
        if (loadedInvoices.isEmpty()) {
            createFallbackSampleData();
        }
    }
    
    private void createFallbackSampleData() {
        // Create fallback sample data
        // This is just for demonstration
        loadedInvoices.clear();
        
        Invoice inv1 = new Invoice();
        inv1.setInvoiceNumber("FACT-202401150001");
        inv1.setIssueDate(LocalDateTime.now().minusDays(2));
        // ... set other properties
        
        Invoice inv2 = new Invoice();
        inv2.setInvoiceNumber("FACT-202401150002");
        inv2.setIssueDate(LocalDateTime.now().minusDays(1));
        // ... set other properties
        
        loadedInvoices.add(inv1);
        loadedInvoices.add(inv2);
    }
    
    private void updateReportsTable() {
        tableModel.setRowCount(0);
        
        for (Invoice invoice : loadedInvoices) {
            String clientName = invoice.getCustomer() != null ? 
                invoice.getCustomer().getName() : "Non spécifié";
                
            tableModel.addRow(new Object[]{
                invoice.getInvoiceNumber(),
                DateUtil.formatDateTime(invoice.getIssueDate()),
                clientName,
                invoice.getSubtotal() + " DT",
                invoice.getTotalTVA() + " DT",
                invoice.getTotalAmount() + " DT",
                invoice.getPaymentMethod() != null ? invoice.getPaymentMethod() : "Non spécifié"
            });
        }
    }
    
    private void updateSummary() {
        double totalSales = 0;
        double totalTVA = 0;
        
        for (Invoice invoice : loadedInvoices) {
            totalSales += invoice.getTotalAmount().doubleValue();
            totalTVA += invoice.getTotalTVA().doubleValue();
        }
        
        totalSalesLabel.setText(String.format("%.3f DT", totalSales));
        totalTVALabel.setText(String.format("%.3f DT", totalTVA));
        invoiceCountLabel.setText(String.valueOf(loadedInvoices.size()));
    }
    
    private void exportToCSV() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Exporter en CSV");
        fileChooser.setSelectedFile(new File("rapport_factures.csv"));
        
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            try (PrintWriter writer = new PrintWriter(file)) {
                // Write header
                writer.println("N° Facture,Date,Client,Sous-total,TVA,Total,Méthode Paiement");
                
                // Write data
                for (Invoice invoice : loadedInvoices) {
                    String clientName = invoice.getCustomer() != null ? 
                        invoice.getCustomer().getName() : "Non spécifié";
                    
                    writer.printf("%s,%s,%s,%.3f,%.3f,%.3f,%s%n",
                        invoice.getInvoiceNumber(),
                        DateUtil.formatDateTime(invoice.getIssueDate()),
                        clientName,
                        invoice.getSubtotal().doubleValue(),
                        invoice.getTotalTVA().doubleValue(),
                        invoice.getTotalAmount().doubleValue(),
                        invoice.getPaymentMethod() != null ? invoice.getPaymentMethod() : "Non spécifié"
                    );
                }
                
                JOptionPane.showMessageDialog(this, "Export CSV réussi!");
                
            } catch (IOException e) {
                JOptionPane.showMessageDialog(this, "Erreur lors de l'export: " + e.getMessage());
            }
        }
    }
    
    private void refreshData() {
        searchInvoices();
        JOptionPane.showMessageDialog(this, "Données actualisées");
    }
}