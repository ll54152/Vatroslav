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

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class UserServiceJPA {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PasswordResetTokenRepo tokenRepo;

    @Autowired
    private EmailService emailService;

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
                return jwtService.generateToken(user.getEmail(), user.getRole());
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

    public void forgotPassword(String email) {
        User user = findByEmail(email);

        if (user == null) {
            return;
        }

        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpirationTime(System.currentTimeMillis() + 1000 * 60 * 15); // 15 min

        tokenRepo.save(resetToken);

        // Send email
        emailService.sendResetEmail(email, token);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optional = tokenRepo.findByToken(token);

        if (optional.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = optional.get();

        if (resetToken.getExpirationTime() < System.currentTimeMillis()) {
            return false;
        }

        User user = findByEmail(resetToken.getEmail());
        if (user == null) {
            return false;
        }

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepo.save(user);

        tokenRepo.delete(resetToken);

        return true;
    }
}
