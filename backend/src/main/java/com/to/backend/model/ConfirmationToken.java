package com.to.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Dokument reprezentujący token potwierdzający rejestrację użytkownika.
 */
@Document(collection = "confirmation_tokens")
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

    public ConfirmationToken() {}

    public ConfirmationToken(String token, String userId, Instant createdAt, Instant expiresAt) {
        this.token = token;
        this.userId = userId;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(Instant confirmedAt) {
        this.confirmedAt = confirmedAt;
    }
}
