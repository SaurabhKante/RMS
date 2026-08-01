package com.rms.dto.payment.request;

import com.rms.entity.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PayDueRequest {

    private String customerName;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid mobile number."
    )
    private String mobileNumber;

    private PaymentMethod paymentMethod;

    @DecimalMin(
            value = "0.01",
            message = "Payment amount must be greater than zero."
    )
    private BigDecimal paymentAmount;

    private String transactionId;
}