package com.to.backend.controller;

import com.to.backend.dto.AuthResponse;
import com.to.backend.dto.LoginRequestDto;
import com.to.backend.dto.RegistrationRequestDto;
import com.to.backend.model.User;
import com.to.backend.security.JwtService;
import com.to.backend.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public RegistrationController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // POST /auth/register – rejestruje nowego użytkownika i zwraca lokalizację zasobu
    // FOR: GUEST (niezalogowani)
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

    // GET /auth/confirm – potwierdza rejestrację przy użyciu tokena
    // FOR: GUEST (użytkownik po rejestracji, jeszcze nieaktywny)
    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token) {
        userService.confirmToken(token);
        return ResponseEntity.ok("Email potwierdzony, Twoje konto jest już aktywne");
    }

    // POST /auth/login – uwierzytelnia użytkownika i zwraca token JWT
    // FOR: GUEST (logowanie)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequestDto loginDto
    ) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        String token = jwtService.generate(
                (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()
        );

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
