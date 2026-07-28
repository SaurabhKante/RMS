package com.rms.repository;
import com.rms.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Integer> {

    Optional<InventoryItem> findByItemId(Integer itemId);

    boolean existsByItemName(String itemName);

    boolean existsByItemNameAndItemIdNot(
            String itemName,
            Integer itemId
    );

    List<InventoryItem> findAllByIsActiveTrue();

    List<InventoryItem> findAllByCreatedAtBetweenAndIsActiveTrue(
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );
}