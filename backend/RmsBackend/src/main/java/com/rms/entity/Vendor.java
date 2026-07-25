package com.rms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "vendors")
public class Vendor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Integer vendorId;

    @Column(name = "vendor_name", nullable = false, unique = true)
    private String vendorName;

    @OneToMany(mappedBy = "vendor", fetch = FetchType.LAZY)
    private List<InventoryItem> inventoryItems = new ArrayList<>();

}