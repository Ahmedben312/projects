// MainFrame.java
package com.tunisiabilling.gui;

import javax.swing.*;
import java.awt.*;

public class MainFrame extends JFrame {
    private JTabbedPane tabbedPane;
    private BillingPanel billingPanel;
    private ProductPanel productPanel;
    private ReportsPanel reportsPanel;
    
    public MainFrame() {
        initializeUI();
    }
    
    private void initializeUI() {
        setTitle("Système de Facturation Tunisien");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1200, 800);
        setLocationRelativeTo(null);
        
        // Create tabbed pane
        tabbedPane = new JTabbedPane();
        
        // Create panels
        billingPanel = new BillingPanel();
        productPanel = new ProductPanel();
        reportsPanel = new ReportsPanel();
        
        // Add tabs - Fixed: All panels extend JPanel which is a Component
        tabbedPane.addTab("📄 Facturation", billingPanel);
        tabbedPane.addTab("📦 Produits", productPanel);
        tabbedPane.addTab("📊 Rapports", reportsPanel);
        
        add(tabbedPane);
        
        // Add menu bar
        setJMenuBar(createMenuBar());
    }
    
    private JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        
        JMenu fileMenu = new JMenu("Fichier");
        JMenuItem exitItem = new JMenuItem("Quitter");
        exitItem.addActionListener(e -> System.exit(0));
        fileMenu.add(exitItem);
        
        JMenu helpMenu = new JMenu("Aide");
        JMenuItem aboutItem = new JMenuItem("À propos");
        aboutItem.addActionListener(e -> showAboutDialog());
        helpMenu.add(aboutItem);
        
        menuBar.add(fileMenu);
        menuBar.add(helpMenu);
        
        return menuBar;
    }
    
    private void showAboutDialog() {
        JOptionPane.showMessageDialog(this,
            "Système de Facturation Tunisien\n" +
            "Conforme à la législation fiscale tunisienne\n" +
            "Version 1.0",
            "À propos",
            JOptionPane.INFORMATION_MESSAGE);
    }
}