package com.rms.ai.dto;

import com.rms.dto.order.request.OrderItemRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents a pending action the customer must confirm on the tablet.
 * The frontend shows a "Place Order" button when this is non-null.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingAction {

    /**
     * Always "CONFIRM_ORDER" in v1.
     */
    private String type;

    /**
     * One-time UUID token. Must be sent back in /confirm-order.
     * Expires in 5 minutes.
     */
    private String confirmToken;

    /**
     * The resolved order items (dishId + quantity) ready to be placed.
     */
    private List<OrderItemRequest> items;
}
