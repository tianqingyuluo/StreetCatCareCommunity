package com.streetCat;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.streetCat.dao")   // 指定 dao 位置
public class StreetCatCareCommunityApplication {
    public static void main(String[] args) {
        SpringApplication.run(StreetCatCareCommunityApplication.class, args);
    }
}