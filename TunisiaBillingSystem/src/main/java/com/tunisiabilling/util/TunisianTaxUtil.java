// TunisianTaxUtil.java
package com.tunisiabilling.util;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public class TunisianTaxUtil {
    
    // TVA rates according to Tunisian law
    public static final BigDecimal TVA_NORMAL = new BigDecimal("19");
    public static final BigDecimal TVA_REDUIT = new BigDecimal("7");
    public static final BigDecimal TVA_ZERO = BigDecimal.ZERO;
    
    public static List<BigDecimal> getValidTVARates() {
        return Arrays.asList(TVA_NORMAL, TVA_REDUIT, TVA_ZERO);
    }
    
    public static boolean isValidTVARate(BigDecimal rate) {
        return getValidTVARates().contains(rate);
    }
    
    public static String getLegalMentions() {
        return "Facture conforme à la législation tunisienne\n" +
               "TVA: 19% (taux normal), 7% (taux réduit)\n" +
               "N° d'identification fiscale: [À compléter]\n" +
               "Article 10 de la loi n°2016-71 du 30 septembre 2016";
    }
}