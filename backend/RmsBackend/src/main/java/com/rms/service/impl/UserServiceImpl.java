package com.rms.service.impl;

import com.rms.dto.user.request.LoginRequest;
import com.rms.dto.user.request.RegisterRequest;
import com.rms.dto.user.request.UpdateUserRequest;
import com.rms.dto.user.request.UpdateUserRoleRequest;
import com.rms.dto.user.response.GetAllUsersResponse;
import com.rms.dto.user.response.LoginResponse;
import com.rms.entity.Role;
import com.rms.entity.User;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.RoleRepository;
import com.rms.repository.UserRepository;
import com.rms.security.CustomUserDetails;
import com.rms.security.JwtService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import com.rms.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;


    @Override
    public ResponseEntity<ApiResponse<Object>> register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            return ResponseHandler.validationFailed(
                    "Email already exists.",
                    null
            );
        }

        Role role = roleRepository.findByRoleName(request.getRole().toUpperCase())
                .orElse(null);

        if(role == null){
            return ResponseHandler.validationFailed(
                    "Invalid Role.",
                    null
            );
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setMobileNo(request.getMobileNo());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(role);

        userRepository.save(user);

        return ResponseHandler.created(
                "User Registered Successfully.",
                null
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(
                userDetails.getUserId(),
                userDetails.getEmail(),
                userDetails.getRole()
        );

        LoginResponse response = LoginResponse.builder()
                .userId(userDetails.getUserId())
                .fullName(userDetails.getFullName())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .token(token)
                .build();

        return ResponseHandler.success(
                "Login Successful.",
                response
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllUsers() {
        List<User> users = userRepository.findAllByIsActiveTrue();
        List<GetAllUsersResponse> response = new ArrayList<>();
        users.forEach(user -> {
            response.add(
                    GetAllUsersResponse.builder()
                            .userId(user.getUserId())
                            .fullName(user.getFullName())
                            .email(user.getEmail())
                            .role(user.getRole().getRoleName())
                            .build()
            );
        });
                return ResponseHandler.success("Fetch All Users Successfully.", response);
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> updateUser(UpdateUserRequest request) {

        CustomUserDetails currentUser =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        // Update Full Name
        if (request.getFullName() != null &&
                !request.getFullName().trim().isEmpty()) {

            user.setFullName(request.getFullName().trim());
        }

        // Update Email
        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            if (userRepository.existsByEmailAndUserIdNot(
                    request.getEmail(),
                    user.getUserId())) {

                throw new BadRequestException("Email already exists.");
            }

            user.setEmail(request.getEmail().trim());
        }

        // Update Mobile
        if (request.getMobileNo() != null &&
                !request.getMobileNo().trim().isEmpty()) {

            user.setMobileNo(request.getMobileNo().trim());
        }

        // Update Password
        if (request.getPassword() != null &&
                !request.getPassword().trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
        }

        userRepository.save(user);

        return ResponseHandler.updated(
                "Profile updated successfully.",
                null
        );
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> updateUserRole(
            Integer userId,
            UpdateUserRoleRequest request) {

        CustomUserDetails loggedInUser =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Only ADMIN can change roles
        if (!"ADMIN".equalsIgnoreCase(loggedInUser.getRole())) {
            throw new BadRequestException(
                    "Only ADMIN can change user roles."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("User is inactive.");
        }

        Role role = roleRepository
                .findByRoleNameAndIsActiveTrue(request.getRole().toUpperCase())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found.")
                );

        // No change needed
        if (user.getRole().getRoleId().equals(role.getRoleId())) {

            return ResponseHandler.success(
                    "User already has this role.",
                    null
            );
        }

        user.setRole(role);

        userRepository.save(user);

        return ResponseHandler.updated(
                "User role updated successfully.",
                null
        );

    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> deleteUser(Integer userId) {

        CustomUserDetails loggedInUser =
                (CustomUserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Only ADMIN can change roles
        if (!"ADMIN".equalsIgnoreCase(loggedInUser.getRole())) {
            throw new BadRequestException(
                    "Only ADMIN can delete the user."
            );
        }

        User user = userRepository.findByUserId(userId).orElseThrow(() ->
                new ResourceNotFoundException("User not found."));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseHandler.updated("User deleted successfully.",null);
    }

}