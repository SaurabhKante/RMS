package com.rms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "restaurant_tables")
public class RestaurantTable extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id")
    private Integer tableId;

    @Column(name = "table_name", nullable = false, unique = true, length = 50)
    private String tableName;

    @Column(name = "seat_capacity", nullable = false)
    private Integer seatCapacity;

    @OneToMany(mappedBy = "restaurantTable", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

}