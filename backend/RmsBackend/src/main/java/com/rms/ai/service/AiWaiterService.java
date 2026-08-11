package com.rms.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rms.ai.client.HuggingFaceClient;
import com.rms.ai.dto.*;
import com.rms.ai.prompt.SystemPromptBuilder;
import com.rms.ai.store.ConfirmTokenStore;
import com.rms.ai.tool.AiWaiterToolExecutor;
import com.rms.entity.Dish;
import com.rms.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Core orchestrator for the AI Waiter feature.
 *
 * Implements the tool-calling loop:
 *   1. Build messages (system prompt + history + user message)
 *   2. Call HF Inference API → parse JSON response
 *   3. If tool_call → execute tool → append result → call HF again
 *   4. Loop until reply_to_customer is set (max iterations guard)
 *   5. Resolve dish summaries for recommended_dish_ids
 *   6. If confirm_order → generate confirm token
 *   7. Return AiChatResponse to controller
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiWaiterService {

    private final HuggingFaceClient huggingFaceClient;
    private final AiWaiterToolExecutor toolExecutor;
    private final SystemPromptBuilder systemPromptBuilder;
    private final ConfirmTokenStore confirmTokenStore;
    private final InternalOrderService internalOrderService;
    private final DishRepository dishRepository;
    private final ObjectMapper objectMapper;

    @Value("${ai.waiter.max-tool-iterations:5}")
    private int maxToolIterations;

    // ─────────────────────────────────────────────────────────────────────────
    // chat() — Main entry point
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Processes a customer message and returns an AI response.
     *
     * @param request chat request from the tablet (tableId, userMessage, history)
     * @return AiChatResponse with replyText, dish cards, and optional confirm action
     */
    public AiChatResponse chat(AiChatRequest request) {
        log.info("AI chat request: table={}, mode={}, message={}",
                request.getTableId(), request.getInputMode(), request.getUserMessage());

        // Build initial messages array
        List<HfMessage> messages = buildInitialMessages(request);

        LlmJsonResponse llmResponse = null;
        int iterations = 0;

        // ── Tool-calling loop ────────────────────────────────────────────────
        while (iterations < maxToolIterations) {
            iterations++;
            log.debug("LLM iteration {} of {}", iterations, maxToolIterations);

            // Call HF API
            String rawContent = huggingFaceClient.chat(messages);

            // Parse LLM JSON response
            llmResponse = parseLlmResponse(rawContent);

            // Append LLM reply to message history for next iteration
            messages.add(new HfMessage("assistant", rawContent));

            // No tool call → LLM has a final answer
            if (llmResponse.getToolCall() == null) {
                log.debug("LLM reached final answer after {} iteration(s)", iterations);
                break;
            }

            // Execute tool
            String toolName = llmResponse.getToolCall().getName();
            var toolArgs = llmResponse.getToolCall().getArgs();
            if (toolArgs == null) toolArgs = Collections.emptyMap();

            String toolResult = toolExecutor.execute(toolName, toolArgs, request.getTableId());
            log.debug("Tool {} result: {}", toolName, toolResult);

            // Append tool result as a user message (standard tool-calling pattern)
            messages.add(new HfMessage("user",
                    "Tool '" + toolName + "' result: " + toolResult +
                    "\nNow use this data to continue helping the customer. Remember to respond with JSON only."
            ));
        }

        // ── Guard: max iterations hit with no final answer ───────────────────
        if (llmResponse == null || llmResponse.getReplyToCustomer() == null) {
            log.warn("LLM did not produce a reply after {} iterations", maxToolIterations);
            return AiChatResponse.builder()
                    .replyText("I'm sorry, I had trouble understanding that. Could you rephrase?")
                    .recommendedDishes(List.of())
                    .build();
        }

        // ── Resolve recommended dish summaries ───────────────────────────────
        List<DishSummary> dishSummaries = resolveDishSummaries(llmResponse.getRecommendedDishIds());

        // ── Handle confirm_order (pending action) ────────────────────────────
        PendingAction pendingAction = null;
        if (llmResponse.getConfirmOrder() != null
                && llmResponse.getConfirmOrder().getItems() != null
                && !llmResponse.getConfirmOrder().getItems().isEmpty()) {

            var items = llmResponse.getConfirmOrder().getItems();
            String token = confirmTokenStore.store(request.getTableId(), items);

            pendingAction = PendingAction.builder()
                    .type("CONFIRM_ORDER")
                    .confirmToken(token)
                    .items(items)
                    .build();

            log.info("Generated confirm token {} for table {}", token, request.getTableId());
        }

        return AiChatResponse.builder()
                .replyText(llmResponse.getReplyToCustomer())
                .recommendedDishes(dishSummaries)
                .pendingAction(pendingAction)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // confirmOrder() — Processes the customer's confirm tap
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Validates the confirm token and places the order in the database.
     * Called when the customer taps the "Place Order" button on the tablet.
     *
     * @param request confirm request with token and resolved items
     */
    public void confirmOrder(ConfirmOrderRequest request) {
        log.info("Confirm order request: table={}, token={}", request.getTableId(), request.getConfirmToken());

        // Validate token (throws if expired or invalid)
        ConfirmTokenStore.ConfirmOrderContext context =
                confirmTokenStore.validate(request.getConfirmToken());

        // Verify the tableId matches what the token was issued for
        if (!context.getTableId().equals(request.getTableId())) {
            throw new IllegalArgumentException("Token does not belong to table " + request.getTableId());
        }

        // Consume the token immediately (one-time use)
        confirmTokenStore.remove(request.getConfirmToken());

        // Use items from the token (not from the request body) to prevent tampering
        var items = context.getItems();

        // Place order — create new or add to existing pending order
        if (internalOrderService.hasPendingOrder(request.getTableId())) {
            log.info("Table {} has existing pending order — adding items", request.getTableId());
            internalOrderService.addItemsToOrder(request.getTableId(), items);
        } else {
            log.info("Table {} has no pending order — creating new order", request.getTableId());
            internalOrderService.createOrder(request.getTableId(), items);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Builds the initial messages array:
     * [system_prompt, ...conversation_history, current_user_message]
     */
    private List<HfMessage> buildInitialMessages(AiChatRequest request) {
        List<HfMessage> messages = new ArrayList<>();

        // 1. System prompt
        messages.add(new HfMessage("system", systemPromptBuilder.build(request.getTableId())));

        // 2. Conversation history from frontend
        if (request.getHistory() != null) {
            for (ConversationMessage msg : request.getHistory()) {
                if (msg == null || msg.getContent() == null || msg.getContent().isBlank()) continue;
                String role = msg.getRole();
                if (role == null || (!role.equalsIgnoreCase("user") && !role.equalsIgnoreCase("assistant"))) {
                    role = "user";
                }
                messages.add(new HfMessage(role.toLowerCase(), msg.getContent()));
            }
        }

        // 3. Current user message
        messages.add(new HfMessage("user", request.getUserMessage()));

        return messages;
    }

    /**
     * Parses the LLM's raw string output into LlmJsonResponse.
     * Handles edge cases where the LLM wraps JSON in markdown code fences.
     */
    private LlmJsonResponse parseLlmResponse(String rawContent) {
        String content = rawContent.trim();

        // Strip markdown code fences if the LLM ignores JSON-only instruction
        if (content.startsWith("```")) {
            content = content
                    .replaceAll("^```(json)?\\s*", "")
                    .replaceAll("\\s*```$", "")
                    .trim();
        }

        try {
            return objectMapper.readValue(content, LlmJsonResponse.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse LLM JSON response: {}", content, e);
            // Return a fallback response so we don't crash
            LlmJsonResponse fallback = new LlmJsonResponse();
            fallback.setReplyToCustomer(
                    "I'm sorry, I couldn't process that. Could you try again?"
            );
            return fallback;
        }
    }

    /**
     * Fetches DishSummary objects for a list of dish IDs returned by the LLM.
     * Silently skips IDs that no longer exist in the DB.
     */
    private List<DishSummary> resolveDishSummaries(List<Integer> dishIds) {
        if (dishIds == null || dishIds.isEmpty()) {
            return List.of();
        }

        return dishIds.stream()
                .map(id -> dishRepository.findByDishIdAndIsActiveTrue(id).orElse(null))
                .filter(dish -> dish != null)
                .map(dish -> DishSummary.builder()
                        .dishId(dish.getDishId())
                        .dishName(dish.getDishName())
                        .description(dish.getDescription())
                        .price(dish.getPrice())
                        .imageUrl(dish.getImageUrl())
                        .tags(dish.getTags())
                        .build())
                .collect(Collectors.toList());
    }
}
