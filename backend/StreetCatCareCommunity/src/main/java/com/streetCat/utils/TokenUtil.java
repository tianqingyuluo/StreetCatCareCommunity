package com.streetCat.utils;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public final class TokenUtil {
    private final String token;

    public static String getUserIdFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return null;
        }
        return JwtUtil.parse(token.replace("Bearer ", ""));
    }
}
