package com.rms.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AiWaiterConfig {

    @Value("${huggingface.api.base-url}")
    private String hfBaseUrl;

    @Value("${huggingface.api.token}")
    private String hfToken;

    /**
     * WebClient pre-configured for Groq (OpenAI-compatible) API calls.
     * Base URL and Bearer token are read from application.properties.
     */
    @Bean(name = "hfWebClient")
    public WebClient hfWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl(hfBaseUrl)
                .defaultHeader("Authorization", "Bearer " + hfToken)
                .defaultHeader("Content-Type", "application/json")
                .codecs(config -> config
                        .defaultCodecs()
                        .maxInMemorySize(10 * 1024 * 1024) // 10MB buffer
                )
                .build();
    }
}
