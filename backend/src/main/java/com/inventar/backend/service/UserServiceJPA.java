package com.inventar.backend.service;

import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.domain.User;
import com.inventar.backend.domain.PasswordResetToken;
import com.inventar.backend.repo.PasswordResetTokenRepo;
import com.inventar.backend.repo.UserRepo;
import com.inventar.backend.security.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class UserServiceJPA {

    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordResetTokenRepo passwordResetTokenRepo;
    private final EmailService emailService;
    private final HttpServletRequest httpServletRequest;
    private final AuthenticationServiceJPA authenticationServiceJPA;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceJPA(BCryptPasswordEncoder bCryptPasswordEncoder, AuthenticationServiceJPA authenticationServiceJPA, HttpServletRequest httpServletRequest, EmailService emailService, PasswordResetTokenRepo passwordResetTokenRepo, JWTService jwtService, AuthenticationManager authenticationManager, UserRepo userRepo) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationServiceJPA = authenticationServiceJPA;
        this.httpServletRequest = httpServletRequest;
        this.emailService = emailService;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRepo = userRepo;
    }

    public boolean register(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        try {
            User newUser = userRepo.save(user);
            return true;
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
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

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

        passwordResetTokenRepo.save(resetToken);

        emailService.sendResetEmail(email, token);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optional = passwordResetTokenRepo.findByToken(token);

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

        passwordResetTokenRepo.delete(resetToken);

        return true;
    }

    public boolean updateUser(User user) {
        Optional<User> optional = userRepo.findByEmail(authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization")));
        if (optional.isEmpty()) {
            return false;
        }

        User existingUser = optional.get();

        // ToDo: Add ID to User so that I can change email from user
        //existingUser.setEmail(user.getEmail());

        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }

        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(
                    bCryptPasswordEncoder.encode(user.getPassword())
            );
        }

        userRepo.save(existingUser);
        return true;
    }

    public boolean doesUserExists() {
        return userRepo.findByEmail(authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"))).isPresent();
    }

    public User getAuthenticatedUser() {
        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));
        return userRepo.findByEmail(email).orElse(null);
    }

    public UserShowDTO mapUserToDTO(User user) {
        if (user == null) {
            return null;
        } else {
            UserShowDTO userShowDTO = new UserShowDTO();
            userShowDTO.setEmail(user.getEmail());
            userShowDTO.setFirstName(user.getFirstName());
            userShowDTO.setLastName(user.getLastName());
            return userShowDTO;
        }
    }
}
