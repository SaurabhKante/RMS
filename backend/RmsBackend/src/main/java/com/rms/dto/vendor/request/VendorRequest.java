package com.rms.dto.vendor.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorRequest {

    @NotBlank(message = "vendorName is required")
    private String vendorName;

}