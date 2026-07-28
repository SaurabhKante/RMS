package com.rms.repository;

import com.rms.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Integer> {

    Optional<Vendor> findByVendorName(String vendorName);

    List<Vendor> findByIsActiveTrue();

}