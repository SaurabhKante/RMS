package com.rms.repository;

import com.rms.entity.CustomerDue;
import com.rms.entity.enums.DueStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerDueRepository
        extends JpaRepository<CustomerDue, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT cd
            FROM CustomerDue cd
            WHERE cd.dueStatus = :status
            AND (
                (:customerName IS NOT NULL AND cd.customerName = :customerName)
                OR
                (:mobileNumber IS NOT NULL AND cd.mobileNumber = :mobileNumber)
            )
            ORDER BY cd.modifiedAt ASC
            """)
    Optional<CustomerDue> findPendingDue(
            @Param("customerName") String customerName,
            @Param("mobileNumber") String mobileNumber,
            @Param("status") DueStatus status
    );

    List<CustomerDue> findByDueStatusOrderByCreatedAtDesc(
            DueStatus dueStatus
    );
}