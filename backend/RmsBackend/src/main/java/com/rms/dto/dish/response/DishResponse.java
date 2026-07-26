package com.rms.dto.dish.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class DishResponse {

    private Integer dishId;

    private String dishName;

    private String description;

    private String dishType;

    private BigDecimal price;

    private String imageUrl;

    private String tags;

    private List<DishResponse> children;

}