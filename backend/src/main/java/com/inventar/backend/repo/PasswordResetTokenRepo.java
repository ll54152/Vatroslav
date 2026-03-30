package com.inventar.backend.repo;

import com.inventar.backend.domain.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}
