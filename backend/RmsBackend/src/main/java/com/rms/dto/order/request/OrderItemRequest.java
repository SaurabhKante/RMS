package com.rms.dto.order.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {

    @NotNull(message = "Dish Id is required.")
    private Integer dishId;

    @NotNull(message = "Quantity is required.")
    @Min(value = 1, message = "Quantity must be greater than 0.")
    private Integer quantity;

}