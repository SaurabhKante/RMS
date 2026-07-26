package com.rms.service.impl;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.dto.dish.response.DishResponse;
import com.rms.entity.Dish;
import com.rms.entity.enums.DishType;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.DishRepository;
import com.rms.service.DishService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {
    private final DishRepository dishRepository;

    @Override
    public ResponseEntity<ApiResponse<Object>> addParentDish(String dishName) {
        if(dishName==null || dishName.isBlank()){
            throw new IllegalArgumentException("dishName can not be empty");
        }
        Dish dish = new Dish();
        dish.setDishName(dishName);
        dish.setDishType(DishType.PARENT);
        dishRepository.save(dish);
        return ResponseHandler.created("Parent Dish Added", null);
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> addChildDish(AddChildDishRequest dishRequest) {
        Dish dish = new Dish();
        dish.setDishName(dishRequest.getDishName());
        dish.setDishType(DishType.CHILD);
        dish.setParentDish(dishRepository.findByDishIdAndIsActiveTrue(dishRequest.getParentDishId()).orElseThrow(() ->
                new ResourceNotFoundException("Parent Dish Not Found")));
        dish.setDescription(dishRequest.getDescription());
        dish.setImageUrl(dishRequest.getImageUrl());
        dish.setPrice(dishRequest.getPrice());
        dish.setTags(dishRequest.getTags());
        dishRepository.save(dish);
        return ResponseHandler.created("Child Dish Added", null);
    }

    private DishResponse convertChildResponse(Dish dish) {

        return DishResponse.builder()
                .dishId(dish.getDishId())
                .dishName(dish.getDishName())
                .description(dish.getDescription())
                .dishType(dish.getDishType().name())
                .price(dish.getPrice())
                .imageUrl(dish.getImageUrl())
                .tags(dish.getTags())
                .build();
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getChildDishes(Integer parentDishId) {

        Dish parentDish = dishRepository
                .findByDishIdAndIsActiveTrue(parentDishId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parent dish not found.")
                );

        if (parentDish.getDishType() != DishType.PARENT) {
            throw new BadRequestException("Given dish is not a parent dish.");
        }

        List<DishResponse> response = dishRepository
                .findByDishIdAndIsActiveTrue(parentDishId)
                .stream()
                .map(this::convertChildResponse)
                .toList();

        return ResponseHandler.success(
                "Child dishes fetched successfully.",
                response
        );
    }

}
