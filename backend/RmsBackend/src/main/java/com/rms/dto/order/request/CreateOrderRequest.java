package com.rms.dto.order.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {

    @NotNull(message = "Table Id is required.")
    private Integer tableId;

    @NotEmpty(message = "Order items cannot be empty.")
    @Valid
    private List<OrderItemRequest> orderItems;

    private String instruction;

}