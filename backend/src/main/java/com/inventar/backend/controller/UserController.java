package com.inventar.backend.controller;

import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.DTO.UserUpdateDTO;
import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.domain.User;
import com.inventar.backend.service.UserServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceJPA userServiceJPA;

    @Autowired
    public UserController(UserServiceJPA userServiceJPA) {
        this.userServiceJPA = userServiceJPA;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user) {
        if (user == null || user.getEmail() == null || user.getPassword() == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Email i lozinka su obavezni"),
                    HttpStatus.BAD_REQUEST);
        }

        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.UNAUTHORIZED.value(), "Neispravni podaci", "Email ili lozinka su pogrešni"),
                    HttpStatus.UNAUTHORIZED);
        } else {
            user.setRole(oldUser.getRole());
            String token = userServiceJPA.verifyLogin(user);
            if (token != null) {
                return new ResponseEntity<>("Bearer" + token, HttpStatus.OK);
            }
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.UNAUTHORIZED.value(), "Neispravni podaci", "Email ili lozinka su pogrešni"),
                    HttpStatus.UNAUTHORIZED);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        if (user == null || user.getEmail() == null || user.getPassword() == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Email i lozinka su obavezni"),
                    HttpStatus.BAD_REQUEST);
        }

        User oldUser = userServiceJPA.findByEmail(user.getEmail());
        if (oldUser != null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Korisnik već postoji", "Korisnik s ovim emailom je već registriran"),
                    HttpStatus.BAD_REQUEST);
        }

        if (userServiceJPA.register(user)) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.CREATED.value(), "Uspješno registovan", "Korisnik je uspješno registriran"),
                    HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Greška pri registraciji", "Došlo je do greške pri registraciji korisnika"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateUser")
    public ResponseEntity<Object> updateUser(@RequestBody UserUpdateDTO userUpdateDTO) {
        if (userUpdateDTO == null || userUpdateDTO.getOldPassword() == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Stara lozinka je obavezna"),
                    HttpStatus.BAD_REQUEST);
        }

        if (!userServiceJPA.doesUserExists()) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Korisnik nije pronađen", "Korisnik ne postoji"),
                    HttpStatus.NOT_FOUND);
        }

        if (userServiceJPA.updateUser(userUpdateDTO)) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno ažurirano", "Podaci korisnika su uspješno ažurirani"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Greška pri ažuriranju", "Stara lozinka je pogrešna ili došlo je do greške"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/aboutMe")
    public ResponseEntity<UserShowDTO> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();
        User user = userServiceJPA.findByEmail(email);
        UserShowDTO userShowDTO = new UserShowDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());

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
    public ResponseEntity<Object> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Token i nova lozinka su obavezni"),
                    HttpStatus.BAD_REQUEST);
        }

        boolean success = userServiceJPA.resetPassword(token, newPassword);

        if (success) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno", "Lozinka je uspješno ažurirana"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ili istekao token", "Token je istekao ili je nevažeći"),
                    HttpStatus.BAD_REQUEST);
        }
    }
}
