package com.inventar.backend.controller;

import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.service.AuthenticationServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    public AuthenticationController(AuthenticationServiceJPA authenticationServiceJPA) {
        this.authenticationServiceJPA = authenticationServiceJPA;
    }

    @GetMapping("/verify")
    public ResponseEntity<Object> verifyToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Authorization header je obavezan"),
                    HttpStatus.BAD_REQUEST);
        }

        boolean isValid = authenticationServiceJPA.verifyToken(authHeader);

        if (isValid) {
            return ResponseEntity.ok().build();
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.UNAUTHORIZED.value(), "Nevalidan token", "Priloženi token je istekao ili nije validan"),
                    HttpStatus.UNAUTHORIZED);
        }
    }
}
