package com.rms.repository;

import com.rms.entity.Dish;
import com.rms.entity.enums.DishType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Integer> {
    Optional<Dish> findByDishIdAndIsActiveTrue(Integer dishId);
    @Query("""
    SELECT d
    FROM Dish d
    WHERE d.parentDish.dishId = :parentDishId
      AND d.isActive = true
      AND d.parentDish.isActive = true
    ORDER BY d.dishName
""")
    List<Dish> findActiveChildren(@Param("parentDishId") Integer parentDishId);
    List<Dish> findByDishTypeAndIsActiveTrue(DishType dishType);

}
