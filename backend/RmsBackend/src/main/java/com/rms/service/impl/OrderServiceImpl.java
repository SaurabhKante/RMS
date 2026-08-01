package com.rms.service.impl;

import com.rms.dto.order.request.AddOrderItemsRequest;
import com.rms.dto.order.request.CreateOrderRequest;
import com.rms.dto.order.request.OrderDetailsRequest;
import com.rms.dto.order.request.OrderItemRequest;
import com.rms.dto.order.response.*;
import com.rms.entity.*;
import com.rms.entity.enums.DishType;
import com.rms.entity.enums.OrderStatus;
import com.rms.entity.enums.PaymentMethod;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.DishRepository;
import com.rms.repository.OrderItemRepository;
import com.rms.repository.OrderRepository;
import com.rms.repository.RestaurantTableRepository;
import com.rms.repository.UserRepository;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import com.rms.security.CustomUserDetails;
import com.rms.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static com.rms.util.DateTimeUtil.format;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> createOrder(CreateOrderRequest request) {


        // Logged-in User
        CustomUserDetails currentUser =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );


        // Table Validation
        RestaurantTable table = restaurantTableRepository
                .findById(request.getTableId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found.")
                );

        if (!Boolean.TRUE.equals(table.getIsActive())) {
            throw new BadRequestException("Table is inactive.");
        }


        // Existing Pending Order

        if (orderRepository.existsByRestaurantTableAndOrderStatus(
                table,
                OrderStatus.PENDING)) {

            throw new BadRequestException(
                    "A pending order already exists for this table."
            );
        }


        // Create Order

        Order order = new Order();

        order.setRestaurantTable(table);
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setInstruction(request.getInstruction());

        BigDecimal totalAmount = BigDecimal.ZERO;

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemResponse> itemResponses = new ArrayList<>();


        // Loop Through Order Items

        for (OrderItemRequest itemRequest : request.getOrderItems()) {

            Dish dish = dishRepository.findById(itemRequest.getDishId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Dish not found : " + itemRequest.getDishId()
                            )
                    );

            if (!Boolean.TRUE.equals(dish.getIsActive())) {
                throw new BadRequestException(
                        dish.getDishName() + " is inactive."
                );
            }

            if (dish.getDishType() != DishType.CHILD) {
                throw new BadRequestException(
                        dish.getDishName() + " cannot be ordered."
                );
            }

            BigDecimal itemTotal =
                    dish.getPrice().multiply(
                            BigDecimal.valueOf(itemRequest.getQuantity())
                    );

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(dish.getPrice());
            orderItem.setTotalPrice(itemTotal);

            orderItems.add(orderItem);

            totalAmount = totalAmount.add(itemTotal);

            itemResponses.add(
                    OrderItemResponse.builder()
                            .dishId(dish.getDishId())
                            .dishName(dish.getDishName())
                            .quantity(itemRequest.getQuantity())
                            .price(dish.getPrice())
                            .totalPrice(itemTotal)
                            .build()
            );

        }


        // Save Order
        order.setTotalAmount(totalAmount);
        order.setDiscount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);


        // Save Order Items
        orderItems.forEach(item -> item.setOrder(savedOrder));

        orderItemRepository.saveAll(orderItems);


        // Response
        CreateOrderResponse response =
                CreateOrderResponse.builder()
                        .orderId(savedOrder.getOrderId())
                        .tableId(table.getTableId())
                        .totalAmount(savedOrder.getTotalAmount())
                        .finalAmount(savedOrder.getFinalAmount())
                        .orderStatus(savedOrder.getOrderStatus())
                        .items(itemResponses)
                        .build();

        return ResponseHandler.created(
                "Order created successfully.",
                response
        );

    }


    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> addItemsToOrder(
            Integer tableId,
            AddOrderItemsRequest request) {


        // Validate Table
        RestaurantTable table = restaurantTableRepository
                .findById(tableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found.")
                );


        // Find Pending Order
        Order order = orderRepository
                .findByRestaurantTableAndOrderStatus(table, OrderStatus.PENDING)
                .orElseThrow(() ->
                        new BadRequestException("No pending order found for this table.")
                );

        BigDecimal additionalAmount = BigDecimal.ZERO;

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemResponse> responseItems = new ArrayList<>();


        // Add New Items
        for (OrderItemRequest itemRequest : request.getOrderItems()) {

            Dish dish = dishRepository.findById(itemRequest.getDishId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Dish not found : " + itemRequest.getDishId()
                            )
                    );

            if (!Boolean.TRUE.equals(dish.getIsActive())) {
                throw new BadRequestException(
                        dish.getDishName() + " is inactive."
                );
            }

            if (dish.getDishType() != DishType.CHILD) {
                throw new BadRequestException(
                        dish.getDishName() + " cannot be ordered."
                );
            }

            BigDecimal itemTotal = dish.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(dish.getPrice());
            orderItem.setTotalPrice(itemTotal);

            orderItems.add(orderItem);

            additionalAmount = additionalAmount.add(itemTotal);

            responseItems.add(
                    OrderItemResponse.builder()
                            .dishId(dish.getDishId())
                            .dishName(dish.getDishName())
                            .quantity(itemRequest.getQuantity())
                            .price(dish.getPrice())
                            .totalPrice(itemTotal)
                            .build()
            );
        }


        // Save New Order Items
        orderItemRepository.saveAll(orderItems);


        // Update Order Amount
        order.setTotalAmount(
                order.getTotalAmount().add(additionalAmount)
        );

        order.setFinalAmount(
                order.getFinalAmount().add(additionalAmount)
        );

        orderRepository.save(order);


        // Response
        CreateOrderResponse response = CreateOrderResponse.builder()
                .orderId(order.getOrderId())
                .tableId(table.getTableId())
                .totalAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .orderStatus(order.getOrderStatus())
                .items(responseItems)
                .build();

        return ResponseHandler.success(
                "Items added successfully.",
                response
        );
    }


    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getPendingOrder(Integer tableId) {

        RestaurantTable table = restaurantTableRepository
                .findById(tableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found.")
                );

        Order order = orderRepository
                .findByRestaurantTableAndOrderStatus(
                        table,
                        OrderStatus.PENDING
                )
                .orElse(null);

        if (order == null) {

            PendingOrderResponse response =
                    PendingOrderResponse.builder()
                            .orderItems(List.of())
                            .totalAmount(BigDecimal.ZERO)
                            .discount(BigDecimal.ZERO)
                            .finalAmount(BigDecimal.ZERO)
                            .build();

            return ResponseHandler.success(
                    "No pending order found for this table.",
                    response
            );
        }

        List<PendingOrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(item ->
                                PendingOrderItemResponse.builder()
                                        .orderItemId(item.getOrderItemId())
                                        .dishId(item.getDish().getDishId())
                                        .dishName(item.getDish().getDishName())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .totalPrice(item.getTotalPrice())
                                        .build()
                        )
                        .toList();

        PendingOrderResponse response =
                PendingOrderResponse.builder()
                        .orderId(order.getOrderId())
                        .createdAt(format(order.getCreatedAt()))
                        .totalAmount(order.getTotalAmount())
                        .discount(order.getDiscount())
                        .finalAmount(order.getFinalAmount())
                        .orderStatus(order.getOrderStatus())
                        .orderItems(items)
                        .build();

        return ResponseHandler.success(
                "Pending order fetched successfully.",
                response
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getAllPendingOrders() {

        List<Order> pendingOrders =
                orderRepository.findByOrderStatus(
                        OrderStatus.PENDING
                );

        if (pendingOrders.isEmpty()) {

            return ResponseHandler.success(
                    "No pending orders found.",
                    List.of()
            );
        }

        List<PendingOrderDetails> response =
                pendingOrders.stream()
                        .map(order ->
                                PendingOrderDetails.builder()
                                        .tableId(
                                                order.getRestaurantTable()
                                                        .getTableId()
                                        )
                                        .totalAmount(
                                                order.getTotalAmount()
                                        )
                                        .build()
                        )
                        .toList();

        return ResponseHandler.success(
                "Pending orders retrieved successfully.",
                response
        );
    }


    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getOrderDetails(
            OrderDetailsRequest request
    ) {

        // Date Range
        LocalDate today = LocalDate.now();

        LocalDate startDate =
                request.getStartDate() != null
                        ? request.getStartDate()
                        : today;

        LocalDate endDate =
                request.getEndDate() != null
                        ? request.getEndDate()
                        : today;

        LocalDateTime startDateTime =
                startDate.atStartOfDay();

        LocalDateTime endDateTime =
                endDate.atTime(
                        LocalTime.MAX
                );

        
        // Fetch Orders
        List<Order> orders =
                orderRepository
                        .findByCreatedAtBetweenOrderByCreatedAtDesc(
                                startDateTime,
                                endDateTime
                        );

        
        // Empty Result
        if (orders.isEmpty()) {

            OrderSummaryResponse summary =
                    OrderSummaryResponse.builder()
                            .totalCash(BigDecimal.ZERO)
                            .totalUpi(BigDecimal.ZERO)
                            .totalCard(BigDecimal.ZERO)
                            .totalCollection(BigDecimal.ZERO)
                            .totalDue(BigDecimal.ZERO)
                            .build();

            OrderDetailsReportResponse response =
                    OrderDetailsReportResponse.builder()
                            .summary(summary)
                            .orders(List.of())
                            .build();

            return ResponseHandler.success(
                    "No orders found for the selected date range.",
                    response
            );
        }

        
        // Summary Variables
        BigDecimal totalCash = BigDecimal.ZERO;
        BigDecimal totalUpi = BigDecimal.ZERO;
        BigDecimal totalCard = BigDecimal.ZERO;
        BigDecimal totalCollection = BigDecimal.ZERO;
        BigDecimal totalDue = BigDecimal.ZERO;

        List<OrderDetailsResponse> orderResponses =
                new ArrayList<>();

        // Process Orders
        for (Order order : orders) {
            // Payments
            List<OrderDetailsPaymentResponse> paymentResponses =
                    new ArrayList<>();

            BigDecimal paidAmount = BigDecimal.ZERO;

            if (order.getPayments() != null) {

                for (Payment payment : order.getPayments()) {

                    /*
                     * DUE is NOT an actual payment.
                     * Therefore it should not be included
                     * in collection.
                     */
                    if (payment.getPaymentMethod() == PaymentMethod.DUE) {
                        continue;
                    }

                    BigDecimal amount =
                            payment.getAmountPaid() != null
                                    ? payment.getAmountPaid()
                                    : BigDecimal.ZERO;

                    paidAmount =
                            paidAmount.add(amount);

                    totalCollection =
                            totalCollection.add(amount);

                    
                    // Payment Method Summary
                    if (payment.getPaymentMethod()
                            == PaymentMethod.CASH) {

                        totalCash =
                                totalCash.add(amount);

                    } else if (payment.getPaymentMethod()
                            == PaymentMethod.UPI) {

                        totalUpi =
                                totalUpi.add(amount);

                    } else if (payment.getPaymentMethod()
                            == PaymentMethod.CARD) {

                        totalCard =
                                totalCard.add(amount);
                    }

                    // Payment Response
                    paymentResponses.add(
                            OrderDetailsPaymentResponse.builder()
                                    .paymentMethod(
                                            payment.getPaymentMethod()
                                    )
                                    .amountPaid(amount)
                                    .transactionId(
                                            payment.getTransactionId()
                                    )
                                    .build()
                    );
                }
            }

            
            // Order Items
            List<OrderDetailsItemResponse> itemResponses =
                    new ArrayList<>();

            if (order.getOrderItems() != null) {

                for (OrderItem orderItem :
                        order.getOrderItems()) {

                    itemResponses.add(
                            OrderDetailsItemResponse.builder()
                                    .dishName(
                                            orderItem
                                                    .getDish()
                                                    .getDishName()
                                    )
                                    .quantity(
                                            orderItem.getQuantity()
                                    )
                                    .price(
                                            orderItem.getPrice()
                                    )
                                    .totalPrice(
                                            orderItem.getTotalPrice()
                                    )
                                    .build()
                    );
                }
            }

            
            // Due Details
            

            OrderDetailsDueResponse dueResponse =
                    null;

            if (order.getCustomerDue() != null) {

                CustomerDue due =
                        order.getCustomerDue();

                BigDecimal dueAmount =
                        due.getDueAmount();

                /*
                 * If dueAmount is NULL in DB,
                 * calculate it manually.
                 */
                if (dueAmount == null) {

                    dueAmount =
                            due.getTotalAmount()
                                    .subtract(
                                            due.getPaidAmount()
                                    );
                }

                totalDue =
                        totalDue.add(dueAmount);

                dueResponse =
                        OrderDetailsDueResponse.builder()
                                .dueAmount(dueAmount)
                                .customerName(
                                        due.getCustomerName()
                                )
                                .mobileNumber(
                                        due.getMobileNumber()
                                )
                                .build();
            }

            
            // Order Response
            OrderDetailsResponse orderResponse =
                    OrderDetailsResponse.builder()
                            .orderId(
                                    order.getOrderId()
                            )
                            .tableId(
                                    order.getRestaurantTable()
                                            .getTableId()
                            )
                            .tableName(
                                    order.getRestaurantTable()
                                            .getTableName()
                            )
                            .totalAmount(
                                    order.getTotalAmount()
                            )
                            .discount(
                                    order.getDiscount()
                            )
                            .finalAmount(
                                    order.getFinalAmount()
                            )
                            .createdAt(
                                    format(order.getCreatedAt())
                            )
                            .paidAmount(
                                    paidAmount
                            )
                            .orderItems(
                                    itemResponses
                            )
                            .payments(
                                    paymentResponses
                            )
                            .dueDetails(
                                    dueResponse
                            )
                            .build();

            orderResponses.add(orderResponse);
        }

        // Summary
        OrderSummaryResponse summary =
                OrderSummaryResponse.builder()
                        .totalCash(totalCash)
                        .totalUpi(totalUpi)
                        .totalCard(totalCard)
                        .totalCollection(totalCollection)
                        .totalDue(totalDue)
                        .build();

        
        // Final Response
        OrderDetailsReportResponse response =
                OrderDetailsReportResponse.builder()
                        .summary(summary)
                        .orders(orderResponses)
                        .build();

        return ResponseHandler.success(
                "Order details fetched successfully.",
                response
        );
    }


    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> deletePendingOrder(
            Integer tableId
    ) {

        // Validate Table
        RestaurantTable table = restaurantTableRepository
                .findById(tableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Table not found."
                        )
                );

        // Find Pending Order
        Order order = orderRepository
                .findByRestaurantTableAndOrderStatus(
                        table,
                        OrderStatus.PENDING
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No pending order found for the given table."
                        )
                );

        // Delete Order
        orderRepository.delete(order);

        // Response
        return ResponseHandler.success(
                "Pending order deleted successfully.",
                null
        );
    }

}