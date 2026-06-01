package com.inventar.backend.controller;

import com.inventar.backend.DTO.LogAddDTO;
import com.inventar.backend.DTO.LogShowAllDTO;
import com.inventar.backend.DTO.LogShowDTO;
import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.service.LogServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/log")
public class LogController {

    private final LogServiceJPA logServiceJPA;

    @Autowired
    public LogController(LogServiceJPA logServiceJPA) {
        this.logServiceJPA = logServiceJPA;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteLog(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID loga mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        if (logServiceJPA.deleteById(id)) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno obrisano", "Log obrisan uspješno"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Log nije pronađen", "Log sa ID: " + id + " ne postoji ili nije moguće obrisati"),
                    HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addLog(@RequestBody LogAddDTO logAddDTO) {
        if (logAddDTO == null || logAddDTO.getNote() == null || logAddDTO.getNote().isEmpty()) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Napomena je obavezna"),
                    HttpStatus.BAD_REQUEST);
        }

        try {
            logServiceJPA.save(logAddDTO);
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.CREATED.value(), "Uspješno kreirano", "Log je uspješno dodat"),
                    HttpStatus.CREATED);
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Greška pri dodavanju loga", ex.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LogShowAllDTO>> getAllLogs() {
        List<LogShowAllDTO> logs = logServiceJPA.findAll();
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Object> getLog(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID loga mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        LogShowDTO log = logServiceJPA.findById(id);
        if (log != null) {
            return new ResponseEntity<>(log, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Log nije pronađen", "Log sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }
    }
}
