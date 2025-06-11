package com.to.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Dokument reprezentujący token potwierdzający rejestrację użytkownika.
 */
@Document(collection = "confirmation_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmationToken {

    @Id
    private String token;

    /**
     * Id użytkownika, dla którego wygenerowano token
     */
    private String userId;

    /**
     * Czas utworzenia tokena
     */
    private Instant createdAt;

    /**
     * Czas wygaśnięcia tokena
     */
    private Instant expiresAt;

    /**
     * Czas potwierdzenia tokena (null jeśli niepotwierdzony)
     */
    private Instant confirmedAt;

    public ConfirmationToken(String token, String userId, Instant createdAt, Instant expiresAt) {
        this.token = token;
        this.userId = userId;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
}
