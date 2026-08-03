package com.rms.repository;

import com.rms.entity.Dish;
import com.rms.entity.Order;
import com.rms.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    Optional<OrderItem> findByOrderAndDish(
            Order order,
            Dish dish
    );

    List<OrderItem> findByOrder(
            Order order
    );

    Optional<OrderItem> findByOrderOrderIdAndDishDishId(
            Integer orderId,
            Integer dishId
    );
}