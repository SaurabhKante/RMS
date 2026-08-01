package com.rms.dto.payment.request;

import com.rms.entity.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentMethodRequest {

    @NotNull(message = "Payment method is required.")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Amount is required.")
    @DecimalMin(value = "0.01", message = "Amount should be greater than zero.")
    private BigDecimal amount;

    /**
     * Required only for ONLINE / UPI / CARD
     */
    private String transactionId;

}