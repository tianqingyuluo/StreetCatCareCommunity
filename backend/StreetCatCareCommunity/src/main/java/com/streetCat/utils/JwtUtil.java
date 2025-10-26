package com.streetCat.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key; // 导入 Key 接口
import java.util.Date;

public class JwtUtil {
    // 1. 密钥 ≥ 256 bit；生产环境放到配置中心
    private static final String KEY_SECRET_STRING = "12345678901234567890123456789012"; // 32 字符
    private static final long EXP = 7200 * 1000; // 2h 毫秒

    // 预先生成一次密钥，避免每次解析时都重新生成
    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(KEY_SECRET_STRING.getBytes());

    /**
     * 2. 生成 JWT
     * @param userId 你要写进去的主键
     * @return token 字符串
     */
    public static String create(String userId) {
        return Jwts.builder()
                .subject(userId)          // 存用户 ID
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXP))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256) // 使用预生成的 Key
                .compact();
    }

    /**
     * 3. 解析并拿到 userId
     */
    public static String parse(String token) {
        System.out.println("解析的Token: '" + token + "'");
        return Jwts.parser()
                .setSigningKey(SIGNING_KEY) // 直接使用 Key 对象，避免弃用警告
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

}