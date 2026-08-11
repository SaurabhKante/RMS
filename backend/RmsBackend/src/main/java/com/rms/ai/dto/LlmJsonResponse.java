package com.rms.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Maps the structured JSON output produced by the LLM.
 *
 * The LLM is instructed via system prompt to always produce exactly this schema.
 * @JsonIgnoreProperties(ignoreUnknown=true) makes it resilient to extra fields.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LlmJsonResponse {

    private String thought;

    @JsonProperty("tool_call")
    private LlmToolCall toolCall;

    @JsonProperty("reply_to_customer")
    private String replyToCustomer;

    @JsonProperty("recommended_dish_ids")
    private List<Integer> recommendedDishIds;

    @JsonProperty("confirm_order")
    private LlmConfirmOrder confirmOrder;
}
