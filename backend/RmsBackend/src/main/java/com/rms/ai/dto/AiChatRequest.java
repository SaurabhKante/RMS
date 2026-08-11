package com.rms.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Request body for POST /api/ai/v1/chat
 * Sent from the tablet on every turn (voice or text).
 */
@Data
public class AiChatRequest {

    @NotNull(message = "tableId is required")
    private Integer tableId;

    @NotBlank(message = "userMessage cannot be empty")
    private String userMessage;

    /**
     * Full conversation history kept in frontend JS memory.
     * Sent with every request so the backend can be fully stateless.
     */
    private List<ConversationMessage> history = new ArrayList<>();

    /**
     * "voice" or "chat" — informational only, does not affect backend logic.
     */
    private String inputMode = "chat";
}
