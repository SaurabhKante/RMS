package com.rms.dto.user.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {

    private Integer userId;

    private String fullName;

    private String email;

    private String role;

    private String token;

}