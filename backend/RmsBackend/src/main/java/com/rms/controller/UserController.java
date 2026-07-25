package com.rms.controller;

import com.rms.dto.user.request.LoginRequest;
import com.rms.dto.user.request.RegisterRequest;
import com.rms.dto.user.request.UpdateUserRequest;
import com.rms.dto.user.request.UpdateUserRoleRequest;
import com.rms.util.ApiResponse;
import com.rms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> register(
            @Valid @RequestBody RegisterRequest request){

        return userService.register(request);

    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(
            @Valid @RequestBody LoginRequest request) {

        return userService.login(request);

    }

    @GetMapping("/get-all-users")
    public ResponseEntity<ApiResponse<Object>> getAllUsers(){
        return userService.getAllUsers();
    }

    @PatchMapping("/update")
    public ResponseEntity<ApiResponse<Object>> updateUser(
            @Valid @RequestBody UpdateUserRequest request) {

        return userService.updateUser(request);
    }

    @PatchMapping("change-role/{userId}")
    public ResponseEntity<ApiResponse<Object>> updateUserRole(
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateUserRoleRequest request) {

        return userService.updateUserRole(userId, request);

    }

    @DeleteMapping("delete-user/{userId}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(
            @PathVariable Integer userId
    ){
        return userService.deleteUser(userId);
    }

}