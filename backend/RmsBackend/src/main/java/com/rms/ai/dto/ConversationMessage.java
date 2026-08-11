package com.rms.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single message in the conversation history.
 * role = "user" | "assistant"
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationMessage {

    private String role;
    private String content;
}
