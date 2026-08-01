package com.rms.dto.order.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class OrderDetailsReportResponse {

    private OrderSummaryResponse summary;

    private List<OrderDetailsResponse> orders;
}