package com.streetCat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationConfig {

    /* 示例：RestTemplate */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}