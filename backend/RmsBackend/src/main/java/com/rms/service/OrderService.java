package com.rms.service;

import com.rms.dto.order.request.AddOrderItemsRequest;
import com.rms.dto.order.request.CreateOrderRequest;
import com.rms.dto.order.request.OrderDetailsRequest;
import com.rms.dto.order.request.OrderItemRequest;
import com.rms.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface OrderService {

    ResponseEntity<ApiResponse<Object>> createOrder(CreateOrderRequest request);
    ResponseEntity<ApiResponse<Object>> addItemsToOrder(
            Integer tableId,
            AddOrderItemsRequest request
    );

    ResponseEntity<ApiResponse<Object>> getPendingOrder(Integer tableId);

    ResponseEntity<ApiResponse<Object>> getAllPendingOrders();

    ResponseEntity<ApiResponse<Object>> getOrderDetails(
            OrderDetailsRequest request
    );

    ResponseEntity<ApiResponse<Object>> deletePendingOrder(
            Integer tableId
    );

}