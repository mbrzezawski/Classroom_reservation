package com.to.backend.repository;

import com.to.backend.model.ConfirmationToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repozytorium do operacji na tokenach potwierdzających rejestrację.
 */
@Repository
public interface ConfirmationTokenRepository extends MongoRepository<ConfirmationToken, String> {
    Optional<ConfirmationToken> findByToken(String token);
}