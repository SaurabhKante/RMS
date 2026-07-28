package com.rms.service.impl;

import com.rms.dto.inventoryitem.request.AddInventoryItemRequest;
import com.rms.dto.inventoryitem.request.GetInventoryItemsRequest;
import com.rms.dto.inventoryitem.request.UpdateInventoryItemRequest;
import com.rms.dto.inventoryitem.response.GetInventoryItemsResponse;
import com.rms.dto.inventoryitem.response.InventoryItemResponse;
import com.rms.entity.InventoryItem;
import com.rms.entity.Vendor;
import com.rms.entity.enums.PaymentMethod;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.InventoryItemRepository;
import com.rms.repository.VendorRepository;
import com.rms.service.InventoryItemService;
import com.rms.util.ApiResponse;
import com.rms.util.DateTimeUtil;
import com.rms.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.rms.util.DateTimeUtil.convertUTCtoIST;
import static com.rms.util.DateTimeUtil.format;

@Service
@RequiredArgsConstructor
public class InventoryItemServiceImpl implements InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final VendorRepository vendorRepository;

    @Override
    public ResponseEntity<ApiResponse<Object>> addInventoryItem(
            AddInventoryItemRequest request) {

        if (inventoryItemRepository.existsByItemName(request.getItemName().trim())) {
            throw new BadRequestException("Inventory Item already exists.");
        }

        Vendor vendor = vendorRepository.findByVendorIdAndIsActiveTrue(request.getVendorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vendor not found."));

        if (!Boolean.TRUE.equals(vendor.getIsActive())) {
            throw new BadRequestException("Vendor is inactive.");
        }

        InventoryItem item = new InventoryItem();

        item.setItemName(request.getItemName().trim());
        item.setPrice(request.getPrice());
        item.setPaymentMethod(request.getPaymentMethod());
        item.setVendor(vendor);

        inventoryItemRepository.save(item);

        return ResponseHandler.created(
                "Inventory Item Added Successfully.",
                null
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllInventoryItems(
            GetInventoryItemsRequest request) {

        LocalDateTime startDateTime =
                request.getStartDate().atStartOfDay();

        LocalDateTime endDateTime =
                request.getEndDate().atTime(23, 59, 59);

        List<InventoryItem> items =
                inventoryItemRepository.findAllByCreatedAtBetweenAndIsActiveTrue(
                        startDateTime,
                        endDateTime
                );

        List<InventoryItemResponse> inventoryResponses =
                new ArrayList<>();

        BigDecimal cashExpenses = BigDecimal.ZERO;
        BigDecimal dueExpenses = BigDecimal.ZERO;
        BigDecimal onlineExpenses = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        for (InventoryItem item : items) {

            inventoryResponses.add(
                    InventoryItemResponse.builder()
                            .itemId(item.getItemId())
                            .itemName(item.getItemName())
                            .price(item.getPrice())
                            .paymentMethod(item.getPaymentMethod())
                            .vendorId(item.getVendor().getVendorId())
                            .vendorName(item.getVendor().getVendorName())
                            .createdAt(format(item.getCreatedAt()))
                            .build()
            );

            totalExpenses = totalExpenses.add(item.getPrice());

            if (item.getPaymentMethod() == PaymentMethod.CASH) {

                cashExpenses = cashExpenses.add(item.getPrice());

            } else if (item.getPaymentMethod() == PaymentMethod.DUE) {

                dueExpenses = dueExpenses.add(item.getPrice());

            } else if (item.getPaymentMethod() == PaymentMethod.UPI) {

                onlineExpenses = onlineExpenses.add(item.getPrice());

            }

        }

        GetInventoryItemsResponse response =
                GetInventoryItemsResponse.builder()
                        .inventoryItems(inventoryResponses)
                        .cashExpenses(cashExpenses)
                        .dueExpenses(dueExpenses)
                        .onlineExpenses(onlineExpenses)
                        .totalExpenses(totalExpenses)
                        .build();

        return ResponseHandler.success(
                "Inventory Items fetched successfully.",
                response
        );
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> updateInventoryItem(
            Integer itemId,
            UpdateInventoryItemRequest request) {

        InventoryItem item = getActiveInventoryItem(itemId);

        // Update Item Name
        if (request.getItemName() != null &&
                !request.getItemName().trim().isEmpty()) {

            if (inventoryItemRepository.existsByItemNameAndItemIdNot(
                    request.getItemName().trim(),
                    itemId)) {

                throw new BadRequestException(
                        "Inventory Item already exists.");
            }

            item.setItemName(request.getItemName().trim());
        }
        if (request.getPrice() != null) {
            item.setPrice(request.getPrice());
        }

        if (request.getPaymentMethod() != null) {
            item.setPaymentMethod(request.getPaymentMethod());
        }

        if (request.getVendorId() != null) {

            Vendor vendor = vendorRepository
                    .findByVendorIdAndIsActiveTrue(request.getVendorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Vendor not found."));

            if (!Boolean.TRUE.equals(vendor.getIsActive())) {
                throw new BadRequestException(
                        "Vendor is inactive.");
            }

            item.setVendor(vendor);
        }

        inventoryItemRepository.save(item);

        return ResponseHandler.updated(
                "Inventory Item updated successfully.",
                null
        );
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> deleteInventoryItem(
            Integer itemId) {

        InventoryItem item = getActiveInventoryItem(itemId);

        item.setIsActive(false);

        inventoryItemRepository.save(item);

        return ResponseHandler.updated(
                "Inventory Item deleted successfully.",
                null
        );
    }

    private InventoryItem getActiveInventoryItem(Integer itemId) {

        InventoryItem item = inventoryItemRepository
                .findByItemId(itemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Inventory Item not found."));

        if (!Boolean.TRUE.equals(item.getIsActive())) {
            throw new BadRequestException("Inventory Item is inactive.");
        }

        return item;
    }
}
