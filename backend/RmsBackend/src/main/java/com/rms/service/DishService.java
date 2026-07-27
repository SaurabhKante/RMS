package com.rms.service;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface DishService {
    ResponseEntity<ApiResponse<Object>> addParentDish(String dishName);

    ResponseEntity<ApiResponse<Object>> addChildDish(@Valid AddChildDishRequest dishRequest);

    ResponseEntity<ApiResponse<Object>> getChildDishes(Integer parentDishId);

    ResponseEntity<ApiResponse<Object>> getAllChildDishes();

    ResponseEntity<ApiResponse<Object>> getAllParentDishes();
}
