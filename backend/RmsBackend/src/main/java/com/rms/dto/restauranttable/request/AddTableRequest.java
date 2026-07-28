package com.rms.dto.restauranttable.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTableRequest {
    @NotBlank(message = "Table name is required.")
    private String tableName;

    @NotNull(message = "Seat Capacity is required.")
    @Min(value = 1, message = "Seat capacity must be greater than 0.")
    private Integer seatCapacity;
}
