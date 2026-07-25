package com.rms.repository;

import com.rms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(Integer userId);

    boolean existsByEmail(String email);

    List<User> findAllByIsActiveTrue();

    boolean existsByEmailAndUserIdNot(String email, Integer userId);
}
