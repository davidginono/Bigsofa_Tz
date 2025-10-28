package com.bigsofa.backend.admin;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final String adminUsername;
    private final String adminPassword;
    private final Map<String, Instant> tokens = new ConcurrentHashMap<>();
    private final Duration tokenTtl = Duration.ofHours(8);

    public AdminAuthService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password}") String adminPassword) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    public String login(String username, String password) {
        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
            throw new AdminUnauthorizedException("Invalid admin credentials");
        }
        String token = UUID.randomUUID().toString();
        tokens.put(token, Instant.now());
        return token;
    }

    public void requireValidToken(String token) {
        if (token == null || token.isBlank()) {
            throw new AdminUnauthorizedException("Missing admin token");
        }
        Instant issuedAt = tokens.get(token);
        if (issuedAt == null) {
            throw new AdminUnauthorizedException("Invalid admin token");
        }
        if (issuedAt.plus(tokenTtl).isBefore(Instant.now())) {
            tokens.remove(token);
            throw new AdminUnauthorizedException("Admin token expired");
        }
    }

    public void logout(String token) {
        if (token != null) {
            tokens.remove(token);
        }
    }
}

