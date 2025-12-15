// DateUtil.java
package com.tunisiabilling.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

public class DateUtil {
    
    private static final Locale TUNISIA_LOCALE = new Locale("fr", "TN");
    
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter
            .ofLocalizedDateTime(FormatStyle.MEDIUM)
            .withLocale(TUNISIA_LOCALE);
        return dateTime.format(formatter);
    }
    
    public static String formatDateForFileName(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        return dateTime.format(formatter);
    }
    
    public static String getCurrentDateTimeString() {
        return formatDateTime(LocalDateTime.now());
    }
    
    public static LocalDateTime parseDateTime(String dateTimeString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter
                .ofLocalizedDateTime(FormatStyle.MEDIUM)
                .withLocale(TUNISIA_LOCALE);
            return LocalDateTime.parse(dateTimeString, formatter);
        } catch (Exception e) {
            return null;
        }
    }
}