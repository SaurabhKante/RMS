package com.rms.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response returned by POST /api/ai/v1/chat
 *
 * replyText         → shown in chat bubble, also spoken via Web Speech API
 * recommendedDishes → rendered as dish cards on the tablet
 * pendingAction     → non-null when LLM resolved an order and customer must confirm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {

    private String replyText;

    private List<DishSummary> recommendedDishes;

    /**
     * Present only when the AI has resolved items and wants the customer to confirm.
     * Frontend shows a "Place Order" confirmation button.
     */
    private PendingAction pendingAction;
}
