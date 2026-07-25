package com.rms.dto.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Full Name is required.")
    private String fullName;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid Mobile Number."
    )
    private String mobileNo;

    @Email(message = "Invalid Email Address.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "Password is required.")
    private String password;

    @NotBlank(message = "Role is required.")
    private String role;

}