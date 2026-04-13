package com.inventar.backend.controller;

import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.domain.User;
import com.inventar.backend.service.UserServiceJPA;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceJPA userServiceJPA;

    public UserController(UserServiceJPA userServiceJPA) {
        this.userServiceJPA = userServiceJPA;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser == null) {
            return new ResponseEntity<>("Pogrešni podatci", HttpStatus.UNAUTHORIZED);
        } else {
            user.setRole(oldUser.getRole());
            String token = userServiceJPA.verifyLogin(user);
            if (token != null) {
                return new ResponseEntity<>("Bearer" + token, HttpStatus.OK);
            }
            return new ResponseEntity<>("Pogrešni podatci", HttpStatus.UNAUTHORIZED);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser != null) {
            return new ResponseEntity<>("Korisnik već postoji!", HttpStatus.BAD_REQUEST);
        }

        if (userServiceJPA.register(user)) {
            return new ResponseEntity<>("Korisnik registriran uspješno!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Greška prilikom registracije korisnika!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        if (!userServiceJPA.doesUserExists()) {
            return new ResponseEntity<>("Korisnik ne postoji!", HttpStatus.BAD_REQUEST);
        }

        if (userServiceJPA.updateUser(user)) {
            return new ResponseEntity<>("Korisnik ažuriran uspješno!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Greška prilikom ažuriranja korisnika!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/aboutMe")
    public ResponseEntity<UserShowDTO> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();
        User user = userServiceJPA.findByEmail(email);
        UserShowDTO userShowDTO = new UserShowDTO(user.getEmail(), user.getFirstName(), user.getLastName());

        return ResponseEntity.ok(userShowDTO);
    }

    @PostMapping("/registerDeprecated")
    public ResponseEntity<String> registerUserDeprecated(@RequestBody User user) {
        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser != null) {
            return new ResponseEntity<>("Korisnik već postoji", HttpStatus.BAD_REQUEST);
        }
        userServiceJPA.registerDeprecated(user);
        return new ResponseEntity<>("Korisnik registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/loginDeprecated")
    public ResponseEntity<String> loginUserDeprecated(@RequestBody User user) {
        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser != null) {
            if (userServiceJPA.loginDeprecated(user.getPassword(), oldUser)) {
                return new ResponseEntity<>("Login successful", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        userServiceJPA.forgotPassword(email);
        return ResponseEntity.ok("If account exists, reset email has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        boolean success = userServiceJPA.resetPassword(token, newPassword);

        if (success) {
            return ResponseEntity.ok("Password updated successfully.");
        } else {
            return new ResponseEntity<>("Invalid or expired token.", HttpStatus.BAD_REQUEST);
        }
    }

}
