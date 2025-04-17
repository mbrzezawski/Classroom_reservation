package com.to.backend.controller;

import com.to.backend.model.User;
import com.to.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        User saved = service.create(user);
        URI location = URI.create("/users/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    // GET /users – retrieves all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(service.findAll());
    }

    // GET /users/{id} – retrieves user by id or returns 404
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /users/{id – deletes user by id, returns 204 or 404
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
