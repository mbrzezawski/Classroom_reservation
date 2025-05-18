package com.to.backend.service;

import com.to.backend.dto.RegistrationRequestDto;
import com.to.backend.model.ConfirmationToken;
import com.to.backend.model.User;
import com.to.backend.model.utils.RoleType;
import com.to.backend.repository.ConfirmationTokenRepository;
import com.to.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private ConfirmationTokenRepository tokenRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Test
    void confirmToken_whenTokenExpired_throwsIllegalStateException() {
        // given
        String token = "expired-token";
        Instant now = Instant.now();
        ConfirmationToken expired = new ConfirmationToken(
                token, "user-id",
                now.minusSeconds(7200),
                now.minusSeconds(3600)
        );
        when(tokenRepo.findByToken(token)).thenReturn(Optional.of(expired));

        // when / then
        IllegalStateException ex = assertThrows(
                IllegalStateException.class,
                () -> userService.confirmToken(token)
        );
        assertEquals("Token expired", ex.getMessage());
        verify(tokenRepo, never()).save(any());
        verify(userRepo, never()).save(any());
    }

    @Test
    void registerNewUser_studentEmail_savesUserWithHashedPassword_studentRoleAndSendsEmail() {
        // given
        RegistrationRequestDto dto = new RegistrationRequestDto();
        dto.setEmail("bob@student.agh.edu.pl");
        dto.setPassword("Secret123");

        when(passwordEncoder.encode("Secret123")).thenReturn("$2a$hash");
        when(userRepo.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        // when
        User created = userService.registerNewUser(dto);

        // then
        // Capture the user passed to save()
        verify(userRepo).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        // Assert user fields
        assertEquals("bob@student.agh.edu.pl", savedUser.getEmail());
        assertEquals("$2a$hash", savedUser.getPassword());
        assertEquals(RoleType.STUDENT, savedUser.getRole());
        assertFalse(savedUser.isEnabled());

        // Verify that confirmation email was sent
        verify(emailService).sendConfirmationEmail(savedUser);

        // The returned user should be the same instance
        assertSame(savedUser, created);
    }
}
