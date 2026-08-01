package com.rms.dto.payment.response;

import com.rms.entity.enums.PaymentMethod;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class PaymentResponse {

    private PaymentMethod paymentMethod;

    private BigDecimal amountPaid;

    private String transactionId;

    private Integer paymentId;

}