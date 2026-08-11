package com.rms.ai.dto;

import lombok.Data;

import java.util.Map;

/**
 * Represents a tool call requested by the LLM in its JSON response.
 */
@Data
public class LlmToolCall {

    private String name;
    private Map<String, Object> args;
}
