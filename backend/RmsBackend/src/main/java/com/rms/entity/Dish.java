package com.rms.entity;

import com.rms.entity.enums.DishType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dishes")
public class Dish extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dish_id")
    private Integer dishId;

    @Column(name = "dish_name", nullable = false, length = 255)
    private String dishName;

    @Enumerated(EnumType.STRING)
    @Column(name = "dish_type", nullable = false)
    private DishType dishType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_dish_id")
    private Dish parentDish;

    @OneToMany(mappedBy = "parentDish")
    private List<Dish> childDishes = new ArrayList<>();

    @OneToMany(mappedBy = "dish")
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "tags")
    private String tags;

}