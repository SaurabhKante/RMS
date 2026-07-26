package com.rms.dto.dish.request;

import com.rms.entity.Dish;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddChildDishRequest {

    @NotBlank(message = "Dish Name Is Required")
    private String dishName;

    private String description;

    @NotNull(message = "Price Is Required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "ParentDishId Is Required")
    private Integer parentDishId;

    private String tags;
}
