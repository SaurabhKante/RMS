package com.rms.controller;

import com.rms.dto.inventoryitem.request.AddInventoryItemRequest;
import com.rms.dto.inventoryitem.request.GetInventoryItemsRequest;
import com.rms.dto.inventoryitem.request.UpdateInventoryItemRequest;
import com.rms.service.InventoryItemService;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory-item/v1")
@RequiredArgsConstructor
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Object>> addInventoryItem(
            @Valid @RequestBody AddInventoryItemRequest request) {

        return inventoryItemService.addInventoryItem(request);
    }

    @PostMapping("/get-all")
    public ResponseEntity<ApiResponse<Object>> getAllInventoryItems(
            @Valid @RequestBody GetInventoryItemsRequest request) {

        return inventoryItemService.getAllInventoryItems(request);
    }

    @PatchMapping("/update/{itemId}")
    public ResponseEntity<ApiResponse<Object>> updateInventoryItem(
            @PathVariable Integer itemId,
            @Valid @RequestBody UpdateInventoryItemRequest request) {

        return inventoryItemService.updateInventoryItem(itemId, request);
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<ApiResponse<Object>> deleteInventoryItem(
            @PathVariable Integer itemId) {

        return inventoryItemService.deleteInventoryItem(itemId);
    }

}
