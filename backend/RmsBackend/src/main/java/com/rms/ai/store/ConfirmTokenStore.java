package com.rms.ai.store;

import com.rms.dto.order.request.OrderItemRequest;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory store for pending order confirmation tokens.
 *
 * When the LLM resolves an order, the backend generates a UUID token,
 * stores it here, and returns it to the frontend. The customer taps
 * "Place Order" → frontend sends the token → backend validates and places the order.
 *
 * Tokens expire after a configurable TTL (default 5 minutes).
 * A scheduled job cleans up expired tokens every 5 minutes.
 */
@Slf4j
@Component
public class ConfirmTokenStore {

    @Value("${ai.waiter.confirm-token-ttl-minutes:5}")
    private int ttlMinutes;

    /**
     * Thread-safe map: token UUID → ConfirmOrderContext
     */
    private final Map<String, ConfirmOrderContext> store = new ConcurrentHashMap<>();

    /**
     * Stores a new pending order and returns its confirmation token.
     *
     * @param tableId the table placing the order
     * @param items   resolved dish items from the LLM
     * @return a one-time UUID token
     */
    public String store(Integer tableId, List<OrderItemRequest> items) {
        String token = UUID.randomUUID().toString();
        ConfirmOrderContext context = ConfirmOrderContext.builder()
                .tableId(tableId)
                .items(items)
                .createdAt(LocalDateTime.now())
                .build();
        store.put(token, context);
        log.debug("Stored confirm token {} for table {}", token, tableId);
        return token;
    }

    /**
     * Validates and retrieves a token's context.
     * Throws IllegalArgumentException if the token is missing or expired.
     * Does NOT remove the token — call remove() after successful order placement.
     *
     * @param token the UUID token from the frontend
     * @return the associated ConfirmOrderContext
     */
    public ConfirmOrderContext validate(String token) {
        ConfirmOrderContext context = store.get(token);

        if (context == null) {
            throw new IllegalArgumentException("Invalid or already used confirmation token.");
        }

        if (context.getCreatedAt().plusMinutes(ttlMinutes).isBefore(LocalDateTime.now())) {
            store.remove(token);
            throw new IllegalArgumentException(
                    "Confirmation token expired. Please re-select your items."
            );
        }

        return context;
    }

    /**
     * Removes the token after successful order placement (one-time use).
     *
     * @param token the UUID token to consume
     */
    public void remove(String token) {
        store.remove(token);
        log.debug("Consumed confirm token {}", token);
    }

    /**
     * Scheduled cleanup — removes all expired tokens every 5 minutes.
     * Prevents memory leak from abandoned sessions.
     */
    @Scheduled(fixedRate = 300_000)
    public void cleanupExpiredTokens() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(ttlMinutes);
        int before = store.size();
        store.entrySet().removeIf(entry -> entry.getValue().getCreatedAt().isBefore(cutoff));
        int removed = before - store.size();
        if (removed > 0) {
            log.info("ConfirmTokenStore cleanup: removed {} expired token(s)", removed);
        }
    }

    // ── Inner context class ────────────────────────────────────────────────────

    @Data
    @Builder
    public static class ConfirmOrderContext {
        private Integer tableId;
        private List<OrderItemRequest> items;
        private LocalDateTime createdAt;
    }
}
