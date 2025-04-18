package com.to.backend.service;

import com.to.backend.model.User;
import com.to.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    public User create(User u) { return repo.save(u); }

    public List<User> findAll() { return repo.findAll(); }

    public Optional<User> findById(String id) { return repo.findById(id); }

    public void delete(String id) { repo.deleteById(id); }
}

