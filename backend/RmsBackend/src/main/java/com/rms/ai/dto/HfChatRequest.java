package com.rms.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Request body for the HF Inference API chat completions endpoint.
 * Maps to: POST /models/Qwen/Qwen2.5-7B-Instruct/v1/chat/completions
 */
@Data
@Builder
public class HfChatRequest {

    private String model;

    private List<HfMessage> messages;

    @JsonProperty("max_tokens")
    private int maxTokens;

    private double temperature;

    /**
     * Stream false — we want the full response at once, not streaming chunks.
     */
    private boolean stream;
}
