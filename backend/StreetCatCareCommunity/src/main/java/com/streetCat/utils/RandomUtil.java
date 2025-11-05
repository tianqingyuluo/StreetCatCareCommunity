package com.streetCat.utils;
import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;

import java.util.concurrent.ThreadLocalRandom;
public class RandomUtil {
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final ThreadLocalRandom R = ThreadLocalRandom.current();
    private static final Snowflake SNOWFLAKE = IdUtil.getSnowflake(1, 1);
    /** 随机昵称：Cat+4位随机码 */
    public static String randomNickname() {
        StringBuilder sb = new StringBuilder("爱猫人士");
        for (int i = 0; i < 4; i++) sb.append(CHARS.charAt(R.nextInt(CHARS.length())));
        return sb.toString();
    }

    public static String randomPhoto() {
        StringBuilder sb = new StringBuilder("photo");
        for (int i = 0; i < 4; i++) sb.append(CHARS.charAt(R.nextInt(CHARS.length())));
        return sb.toString();
    }

    public static long nextId() {
        return SNOWFLAKE.nextId();
    }
}