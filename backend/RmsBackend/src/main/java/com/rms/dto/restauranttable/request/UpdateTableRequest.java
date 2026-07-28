package com.rms.dto.restauranttable.request;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTableRequest {

    private String tableName;

    @Min(value = 1, message = "Seat capacity must be greater than 0.")
    private Integer seatCapacity;
}
