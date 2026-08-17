package com.rms.ai.client;

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
 * HTTP client for Groq / OpenAI-compatible LLM APIs.
 *
 * Current model:
 * openai/gpt-oss-20b
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

    @Value("${huggingface.api.model:openai/gpt-oss-20b}")
    private String modelName;


    /**
     * Sends chat messages to Groq.
     */
    public String chat(List<HfMessage> messages) {

        /*
         * IMPORTANT:
         *
         * Do NOT use maxCompletionTokens.
         *
         * Do NOT use response_format initially.
         *
         * We want Groq to return the model output normally,
         * and AiWaiterService will parse the JSON itself.
         */
        HfChatRequest request = HfChatRequest.builder()
                .model(modelName)
                .messages(messages)
                .max_tokens(1024)
                .temperature(0.3)
                .reasoning_effort("low")
                .stream(false)
                .response_format(null)
                .build();


        int maxRetries = 3;
        int delayMs = 2500;


        for (int attempt = 1; attempt <= maxRetries; attempt++) {

            try {

                log.info(
                        "Calling Groq model={} attempt={}/{} messages={}",
                        modelName,
                        attempt,
                        maxRetries,
                        messages.size()
                );


                /*
                 * Log the actual JSON being sent.
                 *
                 * This is extremely useful when debugging Groq
                 * request validation problems.
                 */
                log.debug(
                        "Groq request: {}",
                        objectMapper.writeValueAsString(request)
                );


                HfChatResponse response = hfWebClient
                        .post()
                        .uri(modelPath)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(HfChatResponse.class)
                        .timeout(Duration.ofSeconds(60))
                        .block();


                if (response == null) {

                    throw new RuntimeException(
                            "Groq API returned null response"
                    );
                }


                String content = response.getFirstChoiceContent();


                if (content == null || content.isBlank()) {

                    throw new RuntimeException(
                            "Groq API returned empty content"
                    );
                }


                log.debug(
                        "Groq response received successfully"
                );


                return content;


            } catch (WebClientResponseException e) {

                String responseBody =
                        e.getResponseBodyAsString();


                log.error(
                        "Groq API HTTP error {} attempt={}/{} response={}",
                        e.getStatusCode(),
                        attempt,
                        maxRetries,
                        responseBody
                );


                /*
                 * 401 - Invalid API key
                 */
                if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {

                    throw new RuntimeException(
                            "Groq API authentication failed. " +
                            "Please check GROQ_API_TOKEN."
                    );
                }


                /*
                 * 400 - Invalid request / model / parameters
                 */
                if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {

                    throw new RuntimeException(
                            "Groq rejected the request: " +
                            responseBody
                    );
                }


                /*
                 * 429 - Rate limit
                 */
                if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {

                    if (attempt < maxRetries) {

                        log.warn(
                                "Groq rate limit hit. Retrying in {} ms",
                                delayMs
                        );


                        try {

                            Thread.sleep(delayMs);

                        } catch (InterruptedException ie) {

                            Thread.currentThread().interrupt();

                            throw new RuntimeException(
                                    "Groq retry interrupted"
                            );
                        }


                        continue;
                    }


                    throw new RuntimeException(
                            "Groq API rate limit reached. " +
                            "Please try again later."
                    );
                }


                /*
                 * 402 - Billing / quota
                 */
                if (e.getStatusCode() == HttpStatus.PAYMENT_REQUIRED) {

                    throw new RuntimeException(
                            "Groq API payment/quota error: " +
                            responseBody
                    );
                }


                /*
                 * 503 - Service unavailable
                 */
                if (e.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE) {

                    if (attempt < maxRetries) {

                        try {

                            Thread.sleep(delayMs);

                        } catch (InterruptedException ie) {

                            Thread.currentThread().interrupt();

                            throw new RuntimeException(
                                    "Groq retry interrupted"
                            );
                        }

                        continue;
                    }


                    throw new RuntimeException(
                            "Groq model service is temporarily unavailable."
                    );
                }


                /*
                 * Other HTTP errors
                 */
                throw new RuntimeException(
                        "Groq API error " +
                        e.getStatusCode() +
                        ": " +
                        responseBody
                );


            } catch (Exception e) {

                log.error(
                        "Groq API call failed: {}",
                        e.getMessage(),
                        e
                );


                throw new RuntimeException(
                        "Failed to reach Groq AI service: " +
                        e.getMessage()
                );
            }
        }


        throw new RuntimeException(
                "Failed to complete Groq AI request after retries."
        );
    }
}