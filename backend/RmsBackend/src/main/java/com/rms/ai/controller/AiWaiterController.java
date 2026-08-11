package com.rms.ai.controller;

import com.rms.ai.dto.AiChatRequest;
import com.rms.ai.dto.AiChatResponse;
import com.rms.ai.dto.ConfirmOrderRequest;
import com.rms.ai.service.AiWaiterService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for the AI Waiter feature.
 *
 * Both endpoints are open (no JWT) — see SecurityConfig for /api/ai/v1/** permitAll.
 * This is intentional: the tablet at the table has no logged-in user.
 *
 * POST /api/ai/v1/chat          → Customer sends a message (voice or text)
 * POST /api/ai/v1/confirm-order → Customer confirms the order after AI suggestion
 */
@Slf4j
@RestController
@RequestMapping("/api/ai/v1")
@RequiredArgsConstructor
public class AiWaiterController {

    private final AiWaiterService aiWaiterService;

    /**
     * Health-check endpoint — verifies the AI Waiter API is reachable.
     * GET /api/ai/v1/status
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Object>> status() {
        return ResponseHandler.success(
                "AI Waiter API is active. Use POST /api/ai/v1/chat to send messages.",
                java.util.Map.of("status", "ACTIVE", "endpoint", "/api/ai/v1/chat", "method", "POST")
        );
    }

    /**
     * Handles a customer message and returns an AI reply.
     *
     * Voice mode:  frontend sends whisper-transcribed text in userMessage
     * Chat mode:   frontend sends raw typed text in userMessage
     *
     * Response includes:
     * - replyText          → display in chat bubble + speak via Web Speech API
     * - recommendedDishes  → render as dish cards
     * - pendingAction      → non-null when customer should confirm an order
     */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Object>> chat(
            @Valid @RequestBody AiChatRequest request
    ) {
        try {
            AiChatResponse response = aiWaiterService.chat(request);
            return ResponseHandler.success("AI response generated", response);
        } catch (RuntimeException e) {
            log.error("AI chat error for table {}: {}", request.getTableId(), e.getMessage());
            return ResponseHandler.failure(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    e.getMessage(),
                    null
            );
        }
    }

    /**
     * Places the order after the customer taps the "Place Order" confirmation button.
     *
     * Validates the confirmToken (must not be expired or already used),
     * then places the order using InternalOrderService (bypasses SecurityContextHolder).
     *
     * Order items are taken from the stored token context — NOT from the request body —
     * to prevent client-side tampering with dish IDs or quantities.
     */
    @PostMapping("/confirm-order")
    public ResponseEntity<ApiResponse<Object>> confirmOrder(
            @Valid @RequestBody ConfirmOrderRequest request
    ) {
        try {
            aiWaiterService.confirmOrder(request);
            return ResponseHandler.created(
                    "Order placed successfully! Your food is on its way. 🎉",
                    null
            );
        } catch (IllegalArgumentException e) {
            // Token invalid, expired, or table mismatch
            log.warn("Confirm order rejected for table {}: {}", request.getTableId(), e.getMessage());
            return ResponseHandler.failure(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        } catch (RuntimeException e) {
            log.error("Confirm order error for table {}: {}", request.getTableId(), e.getMessage());
            return ResponseHandler.failure(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to place order: " + e.getMessage(),
                    null
            );
        }
    }
}
