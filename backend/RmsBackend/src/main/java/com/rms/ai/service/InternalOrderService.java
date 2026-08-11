package com.rms.ai.service;

import com.rms.dto.order.request.OrderItemRequest;
import com.rms.entity.*;
import com.rms.entity.enums.DishType;
import com.rms.entity.enums.OrderStatus;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Handles order creation and item addition for the AI Waiter flow.
 *
 * This service bypasses SecurityContextHolder entirely by accepting a
 * configurable systemUserId from application.properties. This is necessary
 * because the AI endpoint is open (no JWT), so there is no authenticated
 * principal in the security context.
 *
 * The systemUserId should be a valid User row in the database — typically
 * the first admin user. Set ai.waiter.system-user-id in application.properties.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InternalOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    @Value("${ai.waiter.system-user-id:1}")
    private Integer systemUserId;

    /**
     * Creates a brand-new order for a table.
     * Called when no pending order exists for the table.
     *
     * @param tableId the target table
     * @param items   resolved dish items from the LLM
     */
    @Transactional
    public void createOrder(Integer tableId, List<OrderItemRequest> items) {
        RestaurantTable table = validateTable(tableId);

        // Verify no pending order already exists
        if (orderRepository.existsByRestaurantTableAndOrderStatus(table, OrderStatus.PENDING)) {
            throw new BadRequestException(
                    "A pending order already exists for table " + tableId +
                    ". Use add-items instead."
            );
        }

        User systemUser = userRepository.findById(systemUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "System user not found (id=" + systemUserId + "). " +
                        "Set ai.waiter.system-user-id to a valid user ID."
                ));

        Order order = new Order();
        order.setRestaurantTable(table);
        order.setUser(systemUser);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setInstruction("Placed via AI Waiter");

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = buildOrderItems(order, items);

        for (OrderItem oi : orderItems) {
            totalAmount = totalAmount.add(oi.getTotalPrice());
        }

        order.setTotalAmount(totalAmount);
        order.setDiscount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        orderItems.forEach(oi -> oi.setOrder(savedOrder));
        orderItemRepository.saveAll(orderItems);

        log.info("AI Waiter created order for table {}: {} items, total ₹{}",
                tableId, items.size(), totalAmount);
    }

    /**
     * Adds items to an existing pending order for a table.
     * Called when a pending order already exists for the table.
     *
     * @param tableId the target table
     * @param items   resolved dish items from the LLM
     */
    @Transactional
    public void addItemsToOrder(Integer tableId, List<OrderItemRequest> items) {
        RestaurantTable table = validateTable(tableId);

        Order order = orderRepository
                .findByRestaurantTableAndOrderStatus(table, OrderStatus.PENDING)
                .orElseThrow(() -> new BadRequestException(
                        "No pending order found for table " + tableId
                ));

        BigDecimal additionalAmount = BigDecimal.ZERO;
        List<OrderItem> newOrderItems = buildOrderItems(order, items);

        for (OrderItem oi : newOrderItems) {
            additionalAmount = additionalAmount.add(oi.getTotalPrice());
        }

        orderItemRepository.saveAll(newOrderItems);

        // Recalculate totals
        BigDecimal newTotal = order.getTotalAmount().add(additionalAmount);
        order.setTotalAmount(newTotal);

        BigDecimal discount = order.getDiscount() != null ? order.getDiscount() : BigDecimal.ZERO;
        order.setFinalAmount(newTotal.subtract(discount));

        orderRepository.save(order);

        log.info("AI Waiter added {} item(s) to existing order for table {}", items.size(), tableId);
    }

    /**
     * Checks whether a pending order exists for the given table.
     */
    public boolean hasPendingOrder(Integer tableId) {
        return restaurantTableRepository.findById(tableId)
                .map(table -> orderRepository.existsByRestaurantTableAndOrderStatus(
                        table, OrderStatus.PENDING))
                .orElse(false);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private RestaurantTable validateTable(Integer tableId) {
        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableId));

        if (!Boolean.TRUE.equals(table.getIsActive())) {
            throw new BadRequestException("Table " + tableId + " is inactive.");
        }
        return table;
    }

    private List<OrderItem> buildOrderItems(Order order, List<OrderItemRequest> itemRequests) {
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest req : itemRequests) {
            Dish dish = dishRepository.findByDishIdAndIsActiveTrue(req.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Dish not found or inactive: " + req.getDishId()
                    ));

            if (dish.getDishType() != DishType.CHILD) {
                throw new BadRequestException(
                        dish.getDishName() + " is a category, not an orderable dish."
                );
            }

            BigDecimal itemTotal = dish.getPrice()
                    .multiply(BigDecimal.valueOf(req.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(req.getQuantity());
            orderItem.setPrice(dish.getPrice());
            orderItem.setTotalPrice(itemTotal);

            orderItems.add(orderItem);
        }

        return orderItems;
    }
}
