package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class OrderDetailsResponse {

    private Integer orderId;

    private Integer tableId;

    private String tableName;

    private BigDecimal totalAmount;

    private BigDecimal discount;

    private BigDecimal finalAmount;

    private String createdAt;

    private BigDecimal paidAmount;

    private List<OrderDetailsItemResponse> orderItems;

    private List<OrderDetailsPaymentResponse> payments;

    private OrderDetailsDueResponse dueDetails;
}