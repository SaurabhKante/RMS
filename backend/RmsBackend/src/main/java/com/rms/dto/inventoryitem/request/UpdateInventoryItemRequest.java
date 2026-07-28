package com.rms.dto.inventoryitem.request;
import com.rms.entity.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateInventoryItemRequest {

    private String itemName;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0.")
    private BigDecimal price;

    private PaymentMethod paymentMethod;

    private Integer vendorId;

}
