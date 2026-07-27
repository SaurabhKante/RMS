package com.rms.controller;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.service.DishService;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dish/v1")
@RequiredArgsConstructor
public class DishController {
    private final DishService dishService;

    @PostMapping("/add-parent-dish/{dishName}")
    public ResponseEntity<ApiResponse<Object>> addParentDish(@PathVariable String dishName) {
        return dishService.addParentDish(dishName);
    }
    @PostMapping("/add-child-dish")
    public ResponseEntity<ApiResponse<Object>> addChildDish(@Valid @RequestBody AddChildDishRequest dishRequest) {
        return dishService.addChildDish(dishRequest);
    }

    @GetMapping("/get-childs/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> getChildDishes(
            @PathVariable Integer parentDishId) {

        return dishService.getChildDishes(parentDishId);
    }
    @GetMapping("/get-all-childs")
    public ResponseEntity<ApiResponse<Object>> getAllChildDishes(){
        return dishService.getAllChildDishes();
    }
    @GetMapping("/get-all-parents")
    public ResponseEntity<ApiResponse<Object>> getAllParentDishes(){
        return dishService.getAllParentDishes();
    }
}
