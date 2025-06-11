package com.to.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO used for user registration with optional admin/deans codes.
 */
@Data
@NoArgsConstructor
public class RegistrationRequestDto {

    private String email;
    private String name;
    private String surname;
    private String password;

    private String adminCode;
    private String deansCode;
}
