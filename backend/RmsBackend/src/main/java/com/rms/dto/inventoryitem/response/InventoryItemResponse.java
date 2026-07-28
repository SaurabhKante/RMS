package com.rms.dto.inventoryitem.response;
import com.rms.entity.enums.PaymentMethod;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class InventoryItemResponse {

    private Integer itemId;

    private String itemName;

    private BigDecimal price;

    private PaymentMethod paymentMethod;

    private Integer vendorId;

    private String vendorName;

    private String createdAt;

}