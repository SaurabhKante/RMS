package com.rms.dto.payment.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PendingDueResponse {

    private Integer dueId;

    private Integer orderId;

    private String customerName;

    private String mobileNumber;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal dueAmount;

    private LocalDateTime createdAt;
}