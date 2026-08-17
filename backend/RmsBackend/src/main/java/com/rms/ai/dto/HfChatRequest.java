package com.rms.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HfChatRequest {

    private String model;

    private List<HfMessage> messages;

    /*
     * Groq/OpenAI-compatible parameter.
     *
     * IMPORTANT:
     * The Java field is max_tokens.
     *
     * Do NOT use:
     * maxCompletionTokens
     */
    private Integer max_tokens;

    private Double temperature;

    /*
     * GPT-OSS reasoning effort.
     *
     * low / medium / high
     *
     * We will initially leave this null.
     */
    private String reasoning_effort;

    private Boolean stream;

    /*
     * IMPORTANT:
     *
     * Leave this null initially.
     *
     * Groq's structured-output parser can reject
     * generations when the model attempts tool reasoning
     * that doesn't match the requested JSON schema.
     */
    private ResponseFormat response_format;


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseFormat {

        private String type;
    }
}