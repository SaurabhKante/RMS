package com.rms.dto.order.request;

import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OrderDetailsRequest {

    private LocalDate startDate;

    private LocalDate endDate;

    @AssertTrue(message = "Start date cannot be after end date.")
    public boolean isValidDateRange() {

        if (startDate == null || endDate == null) {
            return true;
        }

        return !startDate.isAfter(endDate);
    }
}