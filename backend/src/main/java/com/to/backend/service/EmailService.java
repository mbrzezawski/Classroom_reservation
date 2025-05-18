package com.to.backend.service;

import com.to.backend.model.User;
import com.to.backend.model.ConfirmationToken;
import com.to.backend.repository.ConfirmationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final ConfirmationTokenRepository tokenRepo;
    private final String baseUrl;

    public EmailService(JavaMailSender mailSender,
                        ConfirmationTokenRepository tokenRepo,
                        @Value("${app.base-url}") String baseUrl) {
        this.mailSender = mailSender;
        this.tokenRepo = tokenRepo;
        this.baseUrl = baseUrl;
    }

    /**
     * Generuje token potwierdzający, zapisuje go i wysyła maila z linkiem.
     */
    public void sendConfirmationEmail(User user) {
        String token = UUID.randomUUID().toString();
        Instant now = Instant.now();

        ConfirmationToken ct = new ConfirmationToken(
                token,
                user.getId(),
                now,
                now.plus(24, ChronoUnit.HOURS)
        );
        tokenRepo.save(ct);

        SimpleMailMessage message = getMailMessage(user, token);

        mailSender.send(message);
    }

    private SimpleMailMessage getMailMessage(User user, String token) {
        String link = String.format("%s/auth/confirm?token=%s", baseUrl, token);


        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Potwierdzenie rejestracji w aplikacji");
        message.setText(
                "Cześć,\n\n" +
                        "Aby zakończyć rejestrację, kliknij w poniższy link:\n" +
                        link + "\n\n" +
                        "Link jest ważny przez 24 godziny.\n\n" +
                        "Jeśli nie zakładałeś konta, zignoruj tę wiadomość.\n\n"
        );

        return message;
    }
}
