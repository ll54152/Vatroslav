package com.inventar.backend.service;

import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import com.inventar.backend.security.JWTService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.TransactionSystemException;

@Service
public class UserServiceJPA {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;


    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceJPA(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public boolean register(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        try {
            User newUser = userRepo.save(user);
            if (newUser != null) {
                return true;
            } else {
                return false;
            }
        } catch (TransactionSystemException e) {
            e.printStackTrace();
        }
        return false;
    }

    public User registerDeprecated(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    public String verifyLogin(User user) {

        try {
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(user.getEmail());
            } else {
                return null;
            }

        } catch (AuthenticationException e) {
            return null;
        }

    }

    public boolean loginDeprecated(String password, User oldUser) {
        return bCryptPasswordEncoder.matches(password, oldUser.getPassword());
    }
}
