package com.rms.repository;

import com.rms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Integer> {

    Optional<Role> findByRoleName(String roleName);

    Optional<Role> findByRoleNameAndIsActiveTrue(String roleName);

}