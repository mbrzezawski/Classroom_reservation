package com.to.backend.service;

import com.to.backend.exception.InvalidPasswordException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.exception.SelfDemoteException;
import com.to.backend.model.User;
import com.to.backend.model.utils.RoleType;
import com.to.backend.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public User getUserByEmail(String email){
        return repo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email: ", email));
    }

    public void deleteUser(String id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("User", id);
        }
        repo.deleteById(id);
    }
    public void setUserRole(String id, RoleType roleType){
        User user = getUserById(id);
        String current =
                SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getEmail().equals(current) && roleType != RoleType.ADMIN) {
            throw new SelfDemoteException("Cannot remove your own ADMIN role");
        }
        user.setRole(roleType);
        repo.save(user);
    }

    public User updateProfile(String email, String newEmail) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email: ", email));
        user.setEmail(newEmail);
        return repo.save(user);
    }
    public void changePassword(String email, String currentPwd, String newPwd) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email: ", email));
        if (!user.getPassword().equals(currentPwd)) {
            throw new InvalidPasswordException("Invalid password!");
        }
        user.setPassword(newPwd);
        repo.save(user);
    }

}
