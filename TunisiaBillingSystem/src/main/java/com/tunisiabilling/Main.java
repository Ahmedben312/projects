// Main.java
package com.tunisiabilling;

import com.tunisiabilling.gui.MainFrame;
import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                // Correct method name - it's getSystemLookAndFeelClassName()
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                new MainFrame().setVisible(true);
            } catch (Exception e) {
                e.printStackTrace();
                // Fallback to basic look and feel
                try {
                    UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                new MainFrame().setVisible(true);
            }
        });
    }
}