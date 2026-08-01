package com.rms.dto.order.response;

import com.rms.entity.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class PendingOrderResponse {

    private Integer orderId;

    private String createdAt;

    private BigDecimal totalAmount;

    private BigDecimal discount;

    private BigDecimal finalAmount;

    private OrderStatus orderStatus;

    private List<PendingOrderItemResponse> orderItems;

}