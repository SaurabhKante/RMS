package com.rms.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Lightweight dish summary sent to the frontend for rendering dish cards.
 * Contains only what the tablet UI needs (no internal fields).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishSummary {

    private Integer dishId;
    private String dishName;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String tags;
}
