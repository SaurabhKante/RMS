package com.rms.dto.inventoryitem.request;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GetInventoryItemsRequest {

    @NotNull(message = "Start date is required.")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @NotNull(message = "End date is required.")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate endDate;

}