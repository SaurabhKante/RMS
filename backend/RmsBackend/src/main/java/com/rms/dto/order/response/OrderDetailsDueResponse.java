package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderDetailsDueResponse {

    private BigDecimal dueAmount;

    private String customerName;

    private String mobileNumber;
}