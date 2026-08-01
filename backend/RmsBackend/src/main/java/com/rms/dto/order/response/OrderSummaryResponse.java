package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderSummaryResponse {

    private BigDecimal totalCash;

    private BigDecimal totalUpi;

    private BigDecimal totalCard;

    private BigDecimal totalCollection;

    private BigDecimal totalDue;
}