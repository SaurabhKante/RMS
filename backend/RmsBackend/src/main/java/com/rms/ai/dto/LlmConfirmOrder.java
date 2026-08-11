package com.rms.ai.dto;

import com.rms.dto.order.request.OrderItemRequest;
import lombok.Data;

import java.util.List;

/**
 * Represents the confirm_order block inside the LLM JSON response.
 * Contains the final resolved items the LLM wants to order.
 */
@Data
public class LlmConfirmOrder {

    private List<OrderItemRequest> items;
}
