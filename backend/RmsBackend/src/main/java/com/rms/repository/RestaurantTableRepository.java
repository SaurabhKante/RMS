package com.rms.repository;

import com.rms.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {
    Optional<RestaurantTable> findByTableId(Integer tableId);

    Optional<RestaurantTable> findByTableName(String tableName);

    boolean existsByTableName(String tableName);

    boolean existsByTableNameAndTableIdNot(String tableName, Integer tableId);

    List<RestaurantTable> findAllByIsActiveTrue();
}
