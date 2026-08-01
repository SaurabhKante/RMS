package com.rms.controller;

import com.rms.dto.order.request.AddOrderItemsRequest;
import com.rms.dto.order.request.CreateOrderRequest;
import com.rms.dto.order.request.OrderDetailsRequest;
import com.rms.util.ApiResponse;
import com.rms.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order/v1")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;


     //Create New Order

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Object>> createOrder(
            @Valid @RequestBody CreateOrderRequest request
    ) {

        return orderService.createOrder(request);

    }

      //Add Items To Existing Pending Order

    @PostMapping("/add-items/{tableId}")
    public ResponseEntity<ApiResponse<Object>> addItemsToOrder(
            @PathVariable Integer tableId,
            @Valid @RequestBody AddOrderItemsRequest request
    ) {

        return orderService.addItemsToOrder(
                tableId,
                request
        );

    }

    @GetMapping("/pending-order/{tableId}")
    public ResponseEntity<ApiResponse<Object>> getPendingOrder(
            @PathVariable Integer tableId
    ) {
        return orderService.getPendingOrder(tableId);
    }

    @GetMapping("/pending-orders")
    public ResponseEntity<ApiResponse<Object>> getAllPendingOrders() {

        return orderService.getAllPendingOrders();
    }

    @PostMapping("/order-details")
    public ResponseEntity<ApiResponse<Object>> getOrderDetails(
            @Valid @RequestBody OrderDetailsRequest request
    ) {

        return orderService.getOrderDetails(request);
    }

    @DeleteMapping("/delete-pending-order/{tableId}")
    public ResponseEntity<ApiResponse<Object>> deletePendingOrder(
            @PathVariable Integer tableId
    ) {

        return orderService.deletePendingOrder(tableId);
    }

}