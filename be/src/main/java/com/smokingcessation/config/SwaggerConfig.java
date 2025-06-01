package com.smokingcessation.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smoking Cessation Support Platform API")
                        .version("1.0.0")
                        .description("Tài liệu API cho nền tảng hỗ trợ cai thuốc lá - The Lights Team")
                        .contact(new Contact()
                                .name("The Lights Team")
                                .email("Hoangnvse172524@fpt.edu.com")
                                .url("https://yourproject-url.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
