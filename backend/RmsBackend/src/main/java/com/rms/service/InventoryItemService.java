package com.rms.service;

import com.rms.dto.inventoryitem.request.AddInventoryItemRequest;
import com.rms.dto.inventoryitem.request.GetInventoryItemsRequest;
import com.rms.dto.inventoryitem.request.UpdateInventoryItemRequest;
import com.rms.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface InventoryItemService {

    ResponseEntity<ApiResponse<Object>> addInventoryItem(
            AddInventoryItemRequest request);

    ResponseEntity<ApiResponse<Object>> getAllInventoryItems(
            GetInventoryItemsRequest request);

    ResponseEntity<ApiResponse<Object>> updateInventoryItem(
            Integer itemId,
            UpdateInventoryItemRequest request);

    ResponseEntity<ApiResponse<Object>> deleteInventoryItem(
            Integer itemId);

}
