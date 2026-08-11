package com.rms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Allow localhost and 127.0.0.1 origins
        configuration.setAllowedOriginPatterns(
                List.of("https://hotelix.online",
                        "https://www.hotelix.online",
                        "http://localhost:*",
                        "http://127.0.0.1:*")
        );

        // HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // Request headers
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow Authorization header / cookies if required
        configuration.setAllowCredentials(true);

        // Optional: expose these response headers
        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        // Apply this configuration to all APIs
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}

