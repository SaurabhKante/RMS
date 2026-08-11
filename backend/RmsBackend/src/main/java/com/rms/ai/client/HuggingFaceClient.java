package com.rms.ai.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rms.ai.dto.HfChatRequest;
import com.rms.ai.dto.HfChatResponse;
import com.rms.ai.dto.HfMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;

/**
 * HTTP client for LLM APIs (Groq / HuggingFace / OpenRouter / Ollama).
 * Uses OpenAI-compatible chat completions endpoint.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class HuggingFaceClient {

    @Qualifier("hfWebClient")
    private final WebClient hfWebClient;

    private final ObjectMapper objectMapper;

    @Value("${huggingface.api.model-path}")
    private String modelPath;

    @Value("${huggingface.api.model:llama-3.1-8b-instant}")
    private String modelName;

    /**
     * Sends chat messages to the configured LLM endpoint.
     * Retries up to 2 times on HTTP 429 (Rate Limit Exceeded) with delay.
     *
     * @param messages full conversation (system + history + current user message)
     * @return assistant reply as a raw JSON string
     */
    public String chat(List<HfMessage> messages) {
        HfChatRequest request = HfChatRequest.builder()
                .model(modelName)
                .messages(messages)
                .maxTokens(1024)
                .temperature(0.3)
                .stream(false)
                .build();

        int maxRetries = 3;
        int delayMs = 2500;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.debug("Calling LLM API (attempt {}/{}) with {} messages", attempt, maxRetries, messages.size());

                HfChatResponse response = hfWebClient
                        .post()
                        .uri(modelPath)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(HfChatResponse.class)
                        .timeout(Duration.ofSeconds(60))
                        .block();

                if (response == null) {
                    throw new RuntimeException("LLM API returned null response");
                }

                String content = response.getFirstChoiceContent();
                if (content == null || content.isBlank()) {
                    throw new RuntimeException("LLM API returned empty content");
                }

                return content;

            } catch (WebClientResponseException e) {
                log.error("LLM API HTTP error {} (attempt {}/{}): {}", 
                        e.getStatusCode(), attempt, maxRetries, e.getResponseBodyAsString());

                if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                    if (attempt < maxRetries) {
                        log.info("Rate limit hit (429). Retrying in {}ms...", delayMs);
                        try {
                            Thread.sleep(delayMs);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                        continue;
                    }
                    throw new RuntimeException("API rate limit reached. Please wait a moment and try again.");
                }

                if (e.getStatusCode() == HttpStatus.PAYMENT_REQUIRED) {
                    throw new RuntimeException("HuggingFace credits depleted (402). Please switch provider (e.g. Groq) in application.properties.");
                }

                if (e.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE) {
                    throw new RuntimeException("Model service unavailable. Please try again in a few seconds.");
                }

                throw new RuntimeException("AI service error: " + e.getMessage());
            } catch (Exception e) {
                log.error("LLM API call failed: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to reach AI service: " + e.getMessage());
            }
        }

        throw new RuntimeException("Failed to complete AI request after retries.");
    }
}
