package com.inventar.backend.controller;

import com.inventar.backend.DTO.*;
import com.inventar.backend.domain.*;
import com.inventar.backend.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/experiment")
public class EksperimentController {

    @Autowired
    private EksperimentServiceJPA eksperimentServiceJPA;

    @PostMapping("/add")
    public ResponseEntity<String> addExperiment(@RequestBody EksperimentAddDTO eksperimentAddDTO) {
        eksperimentServiceJPA.save(eksperimentAddDTO);
        return new ResponseEntity<>("Eksperiment added successfully", HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<EksperimentDTO>> getAllExperiments() {
        List<EksperimentDTO> eksperimentDTOs = eksperimentServiceJPA.findAll().stream()
                .map(eksperiment -> new EksperimentDTO(eksperiment.getId(), eksperiment.getName()))
                .toList();
        return new ResponseEntity<>(eksperimentDTOs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Eksperiment> getExperiment(@PathVariable Long id) {
        Eksperiment eksperiment = eksperimentServiceJPA.findById(id);
        if (eksperiment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(eksperiment, HttpStatus.OK);
    }
}
