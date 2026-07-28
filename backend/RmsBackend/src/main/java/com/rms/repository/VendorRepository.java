package com.rms.repository;

import com.rms.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {

    Optional<Vendor> findByVendorIdAndIsActiveTrue(Integer vendorId);

    Optional<Vendor> findByVendorName(String vendorName);

    List<Vendor> findByIsActiveTrue();

}