package com.rms.service;

import com.rms.dto.vendor.request.VendorRequest;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface VendorService {

    ResponseEntity<ApiResponse<Object>> addVendor(VendorRequest vendorRequest);

    ResponseEntity<ApiResponse<Object>> updateVendor(Integer vendorId,
                                                     @Valid VendorRequest vendorRequest);

    ResponseEntity<ApiResponse<Object>> getVendorById(Integer vendorId);

    ResponseEntity<ApiResponse<Object>> getAllVendors();

    ResponseEntity<ApiResponse<Object>> deleteVendor(Integer vendorId);


}