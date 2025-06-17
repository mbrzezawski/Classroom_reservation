package com.to.backend.service;

import com.to.backend.dto.RegistrationRequestDto;
import com.to.backend.exception.InvalidPasswordException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.exception.SelfDemoteException;
import com.to.backend.model.ConfirmationToken;
import com.to.backend.model.User;
import com.to.backend.model.utils.RoleType;
import com.to.backend.repository.ConfirmationTokenRepository;
import com.to.backend.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ConfirmationTokenRepository tokenRepo;

    public UserService(
            UserRepository repo,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            ConfirmationTokenRepository tokenRepo) {
        this.userRepo = repo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenRepo = tokenRepo;
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User getUserById(String id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("User", id));
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email: ", email));
    }

    public void deleteUser(String id) {
        if (!userRepo.existsById(id)) {
            throw new NotFoundException("User", id);
        }
        userRepo.deleteById(id);
    }

    public void setUserRole(String id, RoleType roleType) {
        User user = getUserById(id);
        String current = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getEmail().equals(current) && roleType != RoleType.ADMIN) {
            throw new SelfDemoteException("Cannot remove your own ADMIN role");
        }
        user.setRole(roleType);
        userRepo.save(user);
    }

    public User updateProfile(String email, String newEmail) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email: ", email));
        user.setEmail(newEmail);
        return userRepo.save(user);
    }

    public void changePassword(String email, String currentPwd, String newPwd) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User", email));

        if (!passwordEncoder.matches(currentPwd, user.getPassword())) {
            throw new InvalidPasswordException("Podane hasło jest nieprawidłowe");
        }

        String encodedNew = passwordEncoder.encode(newPwd);
        user.setPassword(encodedNew);
        userRepo.save(user);
    }

    public User registerNewUser(RegistrationRequestDto registrationRequestDto) {
        User user = new User();
        user.setEmail(registrationRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequestDto.getPassword()));
        user.setName(registrationRequestDto.getName());
        user.setSurname(registrationRequestDto.getSurname());
        String email = registrationRequestDto.getEmail().toLowerCase();

        if ("ADMIN_CODE".equals(registrationRequestDto.getAdminCode())) {
            user.setRole(RoleType.ADMIN);
        } else if (email.endsWith("@student.agh.edu.pl")) {
            user.setRole(RoleType.STUDENT);
        } else if (email.endsWith("@agh.edu.pl") && "DEANS_CODE".equals(registrationRequestDto.getDeansCode())) {
            user.setRole(RoleType.DEANS_OFFICE);
        } else if (email.endsWith("@agh.edu.pl")) {
            user.setRole(RoleType.TEACHER);
        }
        user.setEnabled(false);
        user = userRepo.save(user);

        emailService.sendConfirmationEmail(user);

        return user;
    }

    public void confirmToken(String token) {
        ConfirmationToken ct = tokenRepo.findByToken(token)
                .orElseThrow(() -> new NotFoundException("ConfirmationToken", token));

        Instant now = Instant.now();
        if (ct.getConfirmedAt() != null) {
            throw new IllegalStateException("Email already confirmed");
        }
        if (ct.getExpiresAt().isBefore(now)) {
            throw new IllegalStateException("Token expired");
        }

        ct.setConfirmedAt(now);
        tokenRepo.save(ct);

        User user = userRepo.findById(ct.getUserId())
                .orElseThrow(() -> new NotFoundException("User", ct.getUserId()));
        user.setEnabled(true);
        userRepo.save(user);
    }

}
