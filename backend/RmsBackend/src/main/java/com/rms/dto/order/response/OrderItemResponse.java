package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderItemResponse {

    private Integer dishId;

    private String dishName;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;

}