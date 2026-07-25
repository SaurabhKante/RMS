package com.rms.service;

import com.rms.dto.user.request.LoginRequest;
import com.rms.dto.user.request.RegisterRequest;
import com.rms.dto.user.request.UpdateUserRequest;
import com.rms.dto.user.request.UpdateUserRoleRequest;
import com.rms.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<ApiResponse<Object>> register(RegisterRequest request);
    ResponseEntity<ApiResponse<Object>> login(LoginRequest request);

    ResponseEntity<ApiResponse<Object>> getAllUsers();
    ResponseEntity<ApiResponse<Object>> updateUser(UpdateUserRequest request);

    ResponseEntity<ApiResponse<Object>> updateUserRole(
            Integer userId,
            UpdateUserRoleRequest request
    );

    ResponseEntity<ApiResponse<Object>> deleteUser(Integer userId);
}

