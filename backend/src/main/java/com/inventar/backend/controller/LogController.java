package com.inventar.backend.controller;

import com.inventar.backend.domain.*;
import com.inventar.backend.service.LogServiceJPA;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/log")
public class LogController {

    @Autowired
    private LogServiceJPA logServiceJPA;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLog(@PathVariable Long id) {
        Log log = logServiceJPA.findById(id);
        if (log != null) {
            logServiceJPA.deleteById(id);
            return new ResponseEntity<>("Log obrisan uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Log nije pronađen", HttpStatus.NOT_FOUND);
        }
    }
}
