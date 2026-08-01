package com.rms.dto.payment.response;

import com.rms.entity.enums.DueStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class CustomerDueResponse {

    private String customerName;

    private String mobileNumber;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal dueAmount;

    private DueStatus dueStatus;

}