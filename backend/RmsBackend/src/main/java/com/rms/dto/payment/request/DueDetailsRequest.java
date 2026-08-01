package com.rms.dto.payment.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DueDetailsRequest {

    @NotBlank(message = "Customer name is required.")
    private String customerName;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid mobile number."
    )
    private String mobileNumber;

}