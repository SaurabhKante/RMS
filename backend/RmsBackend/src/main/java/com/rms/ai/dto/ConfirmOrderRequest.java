package com.rms.ai.dto;

import com.rms.dto.order.request.OrderItemRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Request body for POST /api/ai/v1/confirm-order
 * Sent by the frontend when customer taps the "Place Order" button.
 *
 * NOTE: items is intentionally NOT @NotEmpty — the actual order items are
 * retrieved server-side from the ConfirmTokenStore to prevent tampering.
 * The frontend may send an empty list or omit it entirely.
 */
@Data
public class ConfirmOrderRequest {

    @NotNull(message = "tableId is required")
    private Integer tableId;

    @NotBlank(message = "confirmToken is required")
    private String confirmToken;

    // Optional — backend uses items stored in the confirm token, not this field
    private List<OrderItemRequest> items;
}
