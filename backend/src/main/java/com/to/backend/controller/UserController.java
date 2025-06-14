package com.to.backend.controller;

import com.to.backend.model.User;
import com.to.backend.model.utils.RoleType;
import com.to.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasAnyRole('ADMIN', 'DEANS_OFFICE')")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // POST /users – creates new user, returns 201 + Location
    // FOR: ADMIN and DEANS_OFFICE
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = service.createUser(user);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    // GET /users – retrieves all users
    // FOR: ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    // GET /users/{id} – retrieves user by id or returns 404 via GlobalExceptionHandler
    // FOR: ADMIN only
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User u = service.getUserById(id);
        return ResponseEntity.ok(u);
    }

    // GET /users/{email} – retrieves user by email
    // FOR: ADMIN only
    @GetMapping("/by-email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = service.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // DELETE /users/{id} – deletes user by id, returns 204 No Content
    // FOR: ADMIN and DEANS_OFFICE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id) {
        service.deleteUser(id);
    }

    // PUT /users/{id}/role – sets user role
    // FOR: ADMIN only
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setUserRole(
            @PathVariable String id,
            @RequestParam RoleType roleType
    ) {
        service.setUserRole(id, roleType);
        return ResponseEntity.noContent().build();
    }
}
