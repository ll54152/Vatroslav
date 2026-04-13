package com.inventar.backend.controller;

import com.inventar.backend.DTO.LogAddDTO;
import com.inventar.backend.domain.Log;
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

@RestController
@RequestMapping("/log")
public class LogController {

    private LogServiceJPA logServiceJPA;

    @Autowired
    public LogController(LogServiceJPA logServiceJPA) {
        this.logServiceJPA = logServiceJPA;
    }

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
    public ResponseEntity<String> addLog(@RequestBody LogAddDTO logAddDTO) {
        logServiceJPA.save(logAddDTO);
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
