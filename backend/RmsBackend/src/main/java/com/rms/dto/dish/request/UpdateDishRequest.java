package com.rms.dto.dish.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class UpdateDishRequest {

    private Integer dishId;

    private String dishName;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String tags;


}