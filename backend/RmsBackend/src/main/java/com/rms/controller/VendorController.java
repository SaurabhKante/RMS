package com.rms.controller;

import com.rms.dto.vendor.request.VendorRequest;
import com.rms.service.VendorService;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor/v1")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/add-vendor")
    public ResponseEntity<ApiResponse<Object>> addVendor(
            @Valid @RequestBody VendorRequest vendorRequest) {

        return vendorService.addVendor(vendorRequest);
    }

    @PutMapping("/update-vendor/{vendorId}")
    public ResponseEntity<ApiResponse<Object>> updateVendor(
            @PathVariable Integer vendorId,
            @Valid @RequestBody VendorRequest vendorRequest) {

        return vendorService.updateVendor(vendorId, vendorRequest);
    }

    @GetMapping("/get-vendor/{vendorId}")
    public ResponseEntity<ApiResponse<Object>> getVendor(
            @PathVariable Integer vendorId) {

        return vendorService.getVendorById(vendorId);
    }

    @GetMapping("/get-all-vendors")
    public ResponseEntity<ApiResponse<Object>> getAllVendors() {

        return vendorService.getAllVendors();
    }

    @DeleteMapping("/delete-vendor/{vendorId}")
    public ResponseEntity<ApiResponse<Object>> deleteVendor(
            @PathVariable Integer vendorId) {

        return vendorService.deleteVendor(vendorId);
    }
}