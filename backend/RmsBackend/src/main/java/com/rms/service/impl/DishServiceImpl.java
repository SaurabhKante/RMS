package com.rms.service.impl;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.dto.dish.request.UpdateDishRequest;
import com.rms.dto.dish.response.DishResponse;
import com.rms.entity.Dish;
import com.rms.entity.enums.DishType;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.DishRepository;
import com.rms.service.DishService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;



import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public UpdateDishRequest convertDishToUpdateDish(Dish dish) {

        UpdateDishRequest updateDish = new UpdateDishRequest();

        updateDish.setDishId(dish.getDishId());
        updateDish.setDishName(dish.getDishName());
        updateDish.setDescription(dish.getDescription());
        updateDish.setPrice(dish.getPrice());
        updateDish.setImageUrl(dish.getImageUrl());
        updateDish.setTags(dish.getTags());

        return updateDish;
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

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllChildDishes() {
          List<UpdateDishRequest> childDishes=dishRepository
                  .findByDishTypeAndIsActiveTrue(DishType.CHILD)
                  .stream()
                  .map(this::convertDishToUpdateDish)
                  .toList();
          if(childDishes.isEmpty()) throw new ResourceNotFoundException("No Child Dishes Available...");

          return ResponseHandler.success(
                  "List Of Child Dishes Retrieved",
                  childDishes
          );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllParentDishes() {
        List<DishResponse> parentDishes=dishRepository
                .findByDishTypeAndIsActiveTrue(DishType.PARENT)
                .stream()
                .map(this::convertChildResponse)
                .toList();

        if(parentDishes.isEmpty()) throw new ResourceNotFoundException("No Parent Dishes Available..");

        List<Map<String,Object>> allParentDishes= parentDishes
                .stream()
                .map(dishResponse ->
                {
                    Map<String, Object> map = new HashMap<>();
                    map.put("Dish Id",dishResponse.getDishId());
                    map.put("Dish Name",dishResponse.getDishName());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseHandler.success(
                "List Of Parent Dishes Retrieved" ,
                allParentDishes
        );
    }
    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Object>> deleteParentDish(Integer parentDishId) {
        Dish parentDish = dishRepository
                .findByDishIdAndIsActiveTrue(parentDishId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parent dish doesn't exists....")
                );
        if(!parentDish.getChildDishes().isEmpty())
            parentDish.getChildDishes().forEach((d)->d.setIsActive(false));
       parentDish.setIsActive(false);
        return ResponseHandler.success(
          "Parent and its Child dishes removed",
          null
        );
    }
    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Object>> deleteChildDish(Integer childDishId) {
        Dish childDish=
                dishRepository.findByDishIdAndIsActiveTrue(childDishId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Child dish doesn't exists....")
                        );
        childDish.setIsActive(false);

        return ResponseHandler.success(
                "Child Dish removed",
                null
        );
    }
    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Object>> updateChildDish(UpdateDishRequest dish) {
        Dish newDish = dishRepository.findByDishIdAndIsActiveTrue(dish.getDishId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Child dish not available to update"));

        if (dish.getDishName() != null && !dish.getDishName().trim().isEmpty()) {
            newDish.setDishName(dish.getDishName().trim());
        }

        if (dish.getDescription() != null) {
            newDish.setDescription(dish.getDescription().trim());
        }

        if (dish.getPrice() != null) {
            newDish.setPrice(dish.getPrice());
        }

        if (dish.getImageUrl() != null && !dish.getImageUrl().trim().isEmpty()) {
            newDish.setImageUrl(dish.getImageUrl().trim());
        }

        if (dish.getTags() != null) {
            newDish.setTags(dish.getTags().trim());
        }

         dishRepository.save(newDish);
         return ResponseHandler.updated(
                 "Child dish updated.",
                 convertDishToUpdateDish(newDish)
         );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getChildDish(Integer childDishId) {
       Dish childDish =
               dishRepository.findByDishIdAndIsActiveTrue(childDishId)
                       .orElseThrow(()->
                              new ResourceNotFoundException("Child dish doesn't exists")
                               );
       return ResponseHandler.success(
               "Child dish record found",
                convertDishToUpdateDish(childDish)
               );
    }


    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Object>> updateParentDish(Integer parentDishId, String dishName) {
        Dish parentDish= dishRepository.findByDishIdAndIsActiveTrue(parentDishId)
                .orElseThrow(()->
                        new ResourceNotFoundException("Parent Dish doesn't exists.")
                );
        parentDish.setDishName(dishName);
        dishRepository.save(parentDish);
        return ResponseHandler.updated(
                "Parent dish updated",
                parentDish.getDishName()
        );
    }
}
