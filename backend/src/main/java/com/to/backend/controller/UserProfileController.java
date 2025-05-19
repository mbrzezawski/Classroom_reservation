package com.to.backend.controller;

import com.to.backend.dto.ChangePasswordDto;
import com.to.backend.dto.UpdateEmailDto;
import com.to.backend.model.User;
import com.to.backend.service.UserService;
import com.to.backend.service.helper.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users/me")
@Validated
//@PreAuthorize("isAuthenticated()")    // require any logged-in user
public class UserProfileController {
    private final UserService userService;

    public UserProfileController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    public User getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        User me = principal.getUser();
        me.setPassword(null);
        return me;
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UpdateEmailDto dto
    ) {
        User updated = userService.updateProfile(
                principal.getUser().getEmail(),
                dto.getEmail()
        );
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ChangePasswordDto dto
    ) {
        userService.changePassword(
                principal.getUser().getEmail(),
                dto.getCurrentPassword(),
                dto.getNewPassword()
        );
    }
}
