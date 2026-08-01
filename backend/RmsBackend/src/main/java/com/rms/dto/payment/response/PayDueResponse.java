package com.rms.dto.payment.response;

import com.rms.entity.enums.DueStatus;
import com.rms.entity.enums.PaymentMethod;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class PayDueResponse {

    private Integer dueId;

    private Integer orderId;

    private String customerName;

    private String mobileNumber;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal dueAmount;

    private DueStatus dueStatus;

    private PaymentMethod paymentMethod;

    private BigDecimal paymentAmount;

    private String transactionId;

}