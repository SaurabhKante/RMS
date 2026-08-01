package com.rms.dto.payment.response;

import com.rms.entity.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class AddPaymentResponse {

    private Integer orderId;

    private Integer tableId;

    private BigDecimal totalAmount;

    private BigDecimal discount;

    private BigDecimal finalAmount;

    private OrderStatus orderStatus;

    private List<PaymentResponse> payments;

    private CustomerDueResponse dueDetails;

}