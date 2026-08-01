package com.rms.dto.payment.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class AddPaymentRequest {

    @NotNull(message = "Table Id is required.")
    private Integer tableId;

    @NotNull(message = "Discount is required.")
    @DecimalMin(value = "0.00", message = "Discount cannot be negative.")
    private BigDecimal discount = BigDecimal.ZERO;

    @Valid
    @NotEmpty(message = "At least one payment method is required.")
    private List<PaymentMethodRequest> payments;

    /**
     * Required only if payment method contains DUE.
     */
    @Valid
    private DueDetailsRequest dueDetails;

}