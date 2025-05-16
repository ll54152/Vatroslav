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

    @PostMapping("/add")
    public ResponseEntity<String> addLog(@RequestBody Log log) {
        logServiceJPA.save(log);
        return new ResponseEntity<>("Log dodat uspešno", HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Log> getLog(@PathVariable Long id) {
        //Todo: možda je bolje koristiti neki DTO kod vraćanja logova
        Log log = logServiceJPA.findById(id);
        if (log != null) {
            return new ResponseEntity<>(log, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
