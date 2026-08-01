package com.rms.repository;

import com.rms.entity.Order;
import com.rms.entity.RestaurantTable;
import com.rms.entity.enums.OrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    /**
     * Find pending order for a table.
     */
    Optional<Order> findByRestaurantTableAndOrderStatus(
            RestaurantTable table,
            OrderStatus orderStatus
    );

    /**
     * Check if a pending order exists for a table.
     */
    boolean existsByRestaurantTableAndOrderStatus(
            RestaurantTable table,
            OrderStatus orderStatus
    );

    List<Order> findByOrderStatus(
            OrderStatus orderStatus
    );

    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );


}