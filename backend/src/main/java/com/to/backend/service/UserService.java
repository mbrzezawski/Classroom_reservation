package com.to.backend.service;

import com.to.backend.exception.NotFoundException;
import com.to.backend.model.User;
import com.to.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    public User createUser(User user) {
        return repo.save(user);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("User", id));
    }

    public void deleteUser(String id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("User", id);
        }
        repo.deleteById(id);
    }
}
