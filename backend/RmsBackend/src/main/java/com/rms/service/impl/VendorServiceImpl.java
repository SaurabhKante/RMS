package com.rms.service.impl;

import com.rms.dto.vendor.request.VendorRequest;
import com.rms.dto.vendor.response.VendorResponse;
import com.rms.entity.Vendor;
import com.rms.exception.DuplicateResourceException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.VendorRepository;
import com.rms.service.VendorService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    @Override
    public ResponseEntity<ApiResponse<Object>> addVendor(VendorRequest vendorRequest) {

        vendorRepository.findByVendorName(vendorRequest.getVendorName())
                .ifPresent(v -> {
                    throw new DuplicateResourceException("Vendor already exists.");
                });

        Vendor vendor = new Vendor();
        vendor.setVendorName(vendorRequest.getVendorName());

        vendorRepository.save(vendor);

        return ResponseHandler.created("Vendor added successfully.", null);
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> updateVendor(Integer vendorId,
                                                            @Valid VendorRequest vendorRequest) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found."));

        vendor.setVendorName(vendorRequest.getVendorName());

        vendorRepository.save(vendor);

        return ResponseHandler.updated("Vendor updated successfully.", null);
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getVendorById(Integer vendorId) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found."));

        VendorResponse response = convertVendorResponse(vendor);

        return ResponseHandler.success(
                "Vendor fetched successfully.",
                response
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllVendors() {

        List<VendorResponse> response = vendorRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertVendorResponse)
                .toList();

        return ResponseHandler.success(
                "Vendor list fetched successfully.",
                response
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> deleteVendor(Integer vendorId) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found."));

        vendor.setIsActive(false);

        vendorRepository.save(vendor);

        return ResponseHandler.success(
                "Vendor deleted successfully.",
                null
        );
    }

    private VendorResponse convertVendorResponse(Vendor vendor) {

        return VendorResponse.builder()
                .vendorId(vendor.getVendorId())
                .vendorName(vendor.getVendorName())
                .isActive(vendor.getIsActive())
                .createdAt(vendor.getCreatedAt())
                .modifiedAt(vendor.getModifiedAt())
                .build();
    }
}