package com.rms.service;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.dto.dish.request.UpdateDishRequest;
import com.rms.dto.dish.response.DishResponse;
import com.rms.entity.Dish;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface DishService {
    ResponseEntity<ApiResponse<Object>> addParentDish(String dishName);

    ResponseEntity<ApiResponse<Object>> addChildDish(@Valid AddChildDishRequest dishRequest);

    ResponseEntity<ApiResponse<Object>> getChildDishes(Integer parentDishId);

    ResponseEntity<ApiResponse<Object>> getAllChildDishes();

    ResponseEntity<ApiResponse<Object>> getAllParentDishes();

    ResponseEntity<ApiResponse<Object>> deleteParentDish(Integer parentDishId);

    ResponseEntity<ApiResponse<Object>> deleteChildDish(Integer childDishId);
    ResponseEntity<ApiResponse<Object>> updateChildDish(UpdateDishRequest dish);
    ResponseEntity<ApiResponse<Object>> getChildDish(Integer childDishId);
    ResponseEntity<ApiResponse<Object>> updateParentDish(Integer parentDishId,String dishName);
}
