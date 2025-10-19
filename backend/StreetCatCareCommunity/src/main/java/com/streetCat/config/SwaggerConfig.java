package com.streetCat.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {   // ← 名字这里
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("流浪猫关爱社区接口文档")
                        .version("1.0")
                        .description("微信小程序+Web 后台"));
    }
}