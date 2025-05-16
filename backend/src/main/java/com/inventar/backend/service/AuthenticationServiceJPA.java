package com.inventar.backend.service;

import com.inventar.backend.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceJPA {

    @Autowired
    private JWTService jwtService;

    public boolean verifyToken(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            return false;
        }

        String token = authHeader.substring(6).trim();

        return jwtService.validateToken(token);
    }

    public String getEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            return null;
        }

        String token = authHeader.substring(6).trim();

        return jwtService.extractEmail(token);
    }

}
