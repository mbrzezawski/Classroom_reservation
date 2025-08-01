package com.to.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO służące do aktualizacji adresu e-mail użytkownika.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmailDto {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]*agh\\.edu\\.pl$",
            message = "Email must end with agh.edu.pl"
    )
    private String email;
}
