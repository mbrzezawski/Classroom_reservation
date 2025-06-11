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
@PreAuthorize("isAuthenticated()") // FOR: EVERYONE LOGGED IN
public class UserProfileController {

    private final UserService userService;

    public UserProfileController(UserService userService){
        this.userService = userService;
    }

    // GET /users/me – retrieves current user's profile
    // FOR: EVERYONE LOGGED IN
    @GetMapping
    public User getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        User me = principal.getUser();
        me.setPassword(null);
        return me;
    }

    // PUT /users/me – updates current user's email address
    // FOR: EVERYONE LOGGED IN
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

    // POST /users/me/password – changes current user's password
    // FOR: EVERYONE LOGGED IN
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

