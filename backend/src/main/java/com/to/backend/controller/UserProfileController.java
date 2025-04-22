package com.to.backend.controller;

import com.to.backend.model.User;
import com.to.backend.service.UserService;
import com.to.backend.service.helper.CustomUserDetails;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users/me")
public class UserProfileController {
    private final UserService userService;

    public UserProfileController(UserService userService){
        this.userService = userService;
    }
    @GetMapping
    public User getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return principal.getUser();
    }
    @PutMapping
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, String> body
    ) throws BadRequestException {
        String newEmail = Optional.ofNullable(body.get("email"))
                .filter(s -> !s.isBlank())
                .orElseThrow(() -> new BadRequestException("email is required"));

        User updated = userService.updateProfile(
                principal.getUser().getEmail(), newEmail);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, String> body
    ) throws BadRequestException {
        String current = Optional.ofNullable(body.get("currentPassword"))
                .orElseThrow(() -> new BadRequestException("currentPassword is required"));
        String next    = Optional.ofNullable(body.get("newPassword"))
                .orElseThrow(() -> new BadRequestException("newPassword is required"));

        userService.changePassword(principal.getUser().getEmail(), current, next);
    }

}
