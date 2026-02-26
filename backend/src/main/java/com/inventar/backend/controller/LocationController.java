package com.inventar.backend.controller;

import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.domain.*;
import com.inventar.backend.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/location")
public class LocationController {
    @Autowired
    private LocationServiceJPA locationServiceJPA;

    @PostMapping("/add")
    public ResponseEntity<String> addLocation(@RequestBody Location location) {
        List<Location> locations = locationServiceJPA.findAll();

        for (Location loc : locations) {
            if (loc.getAdress().equals(location.getAdress()) && loc.getRoom().equals(location.getRoom())) {
                return new ResponseEntity<>("Lokacija već postoji", HttpStatus.BAD_REQUEST);
            }
        }

        locationServiceJPA.save(location);
        return new ResponseEntity<>("Lokacija dodata uspešno", HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<LocationDTO> locationDTOs = locationServiceJPA.findAll().stream()
                .map(location -> new LocationDTO(location.getId(), location.getAdress(), location.getRoom()))
                .toList();
        return new ResponseEntity<>(locationDTOs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable Long id) {
        Location location = locationServiceJPA.findById(id);
        if (location != null) {
            LocationDTO locationDTO = new LocationDTO(location.getId(), location.getAdress(), location.getRoom());
            return new ResponseEntity<>(locationDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable Long id) {
        Location location = locationServiceJPA.findById(id);
        if (location != null) {
            locationServiceJPA.deleteById(id);
            return new ResponseEntity<>("Lokacija obrisana uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Lokacija nije pronađena", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        Location existingLocation = locationServiceJPA.findById(id);
        if (existingLocation != null) {
            if (location.getAdress() != null && !location.getAdress().isEmpty()) {
                existingLocation.setAdress(location.getAdress());
            }
            if (location.getRoom() != null && !location.getRoom().isEmpty()) {
                existingLocation.setRoom(location.getRoom());
            }
            locationServiceJPA.save(existingLocation);
            return new ResponseEntity<>("Lokacija ažurirana uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Lokacija nije pronađena", HttpStatus.NOT_FOUND);
        }
    }
}
