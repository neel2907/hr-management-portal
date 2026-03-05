package com.company.portal.auth;

import com.company.portal.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        revokeTokensForUser(user);

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusDays(7));
        token.setRevoked(false);

        return refreshTokenRepository.save(token);
    }

    @Transactional
    public void revokeTokensForUser(User user) {
        List<RefreshToken> tokens = refreshTokenRepository.findByUserId(user.getId());
        for (RefreshToken t : tokens) {
            if (!t.isRevoked()) {
                t.setRevoked(true);
            }
        }
        if (!tokens.isEmpty()) {
            refreshTokenRepository.saveAll(tokens);
        }
    }

    @Transactional
    public RefreshToken validateAndGet(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            throw new RuntimeException("Refresh token expired or revoked");
        }

        return token;
    }
}

