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
@RequestMapping("/component")
public class KomponentaController {

    @Autowired
    private KomponentaServiceJPA komponentaServiceJPA;

    @PostMapping("/add")
    public ResponseEntity<String> addComponent(@RequestBody KomponentaAddDTO komponentaDTO) {
        Komponenta oldKomponenta = komponentaServiceJPA.findByZpf(komponentaDTO.getZpf());
        if (oldKomponenta != null) {
            return new ResponseEntity<>("Komponenta već postoji", HttpStatus.BAD_REQUEST);
        }

        komponentaServiceJPA.save(komponentaDTO);
        return new ResponseEntity<>("Komponenta dodata uspešno", HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<KomponentaDTO>> getAllComponents() {
        List<KomponentaDTO> komponentaDTOs = komponentaServiceJPA.findAll().stream()
                .map(komponenta -> new KomponentaDTO(komponenta.getId(), komponenta.getName()))
                .toList();
        return new ResponseEntity<>(komponentaDTOs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<KomponentaShowDTO> getComponent(@PathVariable Long id) {
        Komponenta komponenta = komponentaServiceJPA.findById(id);
        if (komponenta == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(komponentaServiceJPA.getShowDTO(komponenta), HttpStatus.OK);
        }


    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComponent(@PathVariable Long id) {
        Komponenta komponenta = komponentaServiceJPA.findById(id);
        if (komponenta != null) {
            komponentaServiceJPA.deleteById(id);
            return new ResponseEntity<>("Komponenta obrisana uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Komponenta nije pronađena", HttpStatus.NOT_FOUND);
        }
    }
}
