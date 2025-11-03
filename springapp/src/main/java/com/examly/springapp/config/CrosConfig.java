package com.examly.springapp.config;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
 
@Configuration
@EnableWebMvc
public class CrosConfig {
 
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
<<<<<<< HEAD
                            "https://8081-facafcdbdfacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/",
=======
                            "https://8081-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/",
>>>>>>> origin/main
                            "http://127.0.0.1:3000"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}