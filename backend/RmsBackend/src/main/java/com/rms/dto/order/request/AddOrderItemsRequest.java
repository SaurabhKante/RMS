package com.rms.dto.order.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddOrderItemsRequest {

    @Valid
    @NotEmpty(message = "Order items cannot be empty.")
    private List<OrderItemRequest> orderItems;

}