package com.rms.dto.inventoryitem.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class GetInventoryItemsResponse {

    private List<InventoryItemResponse> inventoryItems;

    private BigDecimal cashExpenses;

    private BigDecimal dueExpenses;

    private BigDecimal onlineExpenses;

    private BigDecimal totalExpenses;

}