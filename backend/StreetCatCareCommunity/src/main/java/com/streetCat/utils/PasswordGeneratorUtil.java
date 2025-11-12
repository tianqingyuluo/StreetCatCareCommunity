package com.streetCat.utils;

import java.security.SecureRandom;

public final class PasswordGeneratorUtil {
    private static final String CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RAND = new SecureRandom();

    public static String random(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(RAND.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private PasswordGeneratorUtil() {}   // 禁止实例化
}
