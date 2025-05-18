package com.to.backend.controller;

import com.to.backend.dto.LoginRequestDto;
import com.to.backend.dto.RegistrationRequestDto;
import com.to.backend.model.User;
import com.to.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public RegistrationController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @Valid @RequestBody RegistrationRequestDto dto
    ) {
        User created = userService.registerNewUser(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/users/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token) {
        userService.confirmToken(token);
        return ResponseEntity.ok("Email potwierdzony, Twoje konto jest już aktywne");
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @Valid @RequestBody LoginRequestDto loginDto
    ) {
        // 1) build authentication token
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                );

        // 2) authenticate (throws BadCredentialsException if invalid, DisabledException if user.isEnabled==false)
        Authentication auth = authenticationManager.authenticate(authToken);

        // 3) store in SecurityContext + session
        SecurityContextHolder.getContext().setAuthentication(auth);

        // 4) return 200 OK; JSESSIONID cookie is now set by Spring Security
        return ResponseEntity.ok().build();
    }

}
