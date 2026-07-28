package com.rms.controller;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.dto.dish.request.UpdateDishRequest;
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
    @DeleteMapping("/remove-parent-dish/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> deleteParentDish(
            @PathVariable Integer parentDishId ){
         return dishService.deleteParentDish(parentDishId);
    }
    @DeleteMapping("remove-child-dish/{childDishId}")
    public ResponseEntity<ApiResponse<Object>> deleteChildDish(
            @PathVariable Integer childDishId
    ){
        return dishService.deleteChildDish(childDishId);
    }
    @PatchMapping("update-parent-dish/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> updateParentDish(
            @PathVariable Integer parentDishId, @RequestBody String dishName
    ){
        return dishService.updateParentDish(parentDishId,dishName);
    }
    @PutMapping("update-child-dish")
    public ResponseEntity<ApiResponse<Object>> updateChildDish(
             @RequestBody UpdateDishRequest dish
            ){
        return dishService.updateChildDish(dish);
    }
    @GetMapping("get-dish/{childDishId}")
    public ResponseEntity<ApiResponse<Object>> getChildDish(
            @PathVariable Integer childDishId
    ){
        return dishService.getChildDish(childDishId);
    }
}
