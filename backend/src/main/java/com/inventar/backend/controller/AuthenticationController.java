package com.inventar.backend.controller;

import com.inventar.backend.service.AuthenticationServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "*")
public class AuthenticationController {


    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyToken(@RequestHeader("Authorization") String authHeader) {

        boolean isValid = authenticationServiceJPA.verifyToken(authHeader);

        if (isValid) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
