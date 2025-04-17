package com.to.backend.controller;

import com.to.backend.model.User;
import com.to.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // POST /users – creates new user, returns 201 + Location
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
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    // GET /users/{id} – retrieves user by id or returns 404 via GlobalExceptionHandler
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User u = service.getUserById(id);
        return ResponseEntity.ok(u);
    }

    // DELETE /users/{id} – deletes user by id, returns 204 No Content
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id) {
        service.deleteUser(id);
    }
}
