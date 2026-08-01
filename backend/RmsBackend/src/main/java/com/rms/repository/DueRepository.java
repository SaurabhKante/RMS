package com.rms.repository;

import com.rms.entity.CustomerDue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DueRepository extends JpaRepository<CustomerDue, Integer> {
}