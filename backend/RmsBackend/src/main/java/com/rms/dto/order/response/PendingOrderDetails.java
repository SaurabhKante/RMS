package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class PendingOrderDetails {

    private Integer tableId;

    private BigDecimal totalAmount;
}
