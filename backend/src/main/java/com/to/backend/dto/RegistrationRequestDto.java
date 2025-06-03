package com.to.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegistrationRequestDto {

//    @NotBlank(message = "Email is required")
//    @Email(message = "Invalid email format")
//    @Pattern(
//            regexp = "^[A-Za-z0-9._%+-]+@((student\\.agh\\.edu\\.pl)|(agh\\.edu\\.pl))$",
//            message = "Email must end with @agh.edu.pl or @student.agh.edu.pl"
//    )
    private String email;

//    @NotBlank(message = "Password is required")
//    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private String adminCode;

    public RegistrationRequestDto() { }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAdminCode(){return adminCode;}
}
