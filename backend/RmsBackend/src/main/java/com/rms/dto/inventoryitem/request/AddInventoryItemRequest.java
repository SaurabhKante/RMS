package com.rms.dto.inventoryitem.request;
import com.rms.entity.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddInventoryItemRequest {

    @NotBlank(message = "Item name is required.")
    private String itemName;

    @NotNull(message = "Price is required.")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0.")
    private BigDecimal price;

    @NotNull(message = "Payment method is required.")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Vendor Id is required.")
    private Integer vendorId;

}
