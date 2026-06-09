package com.inventar.backend.controller;

import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.domain.Location;
import com.inventar.backend.service.LocationServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationServiceJPA locationServiceJPA;

    @Autowired
    public LocationController(LocationServiceJPA locationServiceJPA) {
        this.locationServiceJPA = locationServiceJPA;
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addLocation(@RequestBody Location location) {
        List<Location> locationList = locationServiceJPA.findAll();

        for (Location loc : locationList) {
            if (loc.getAddress().equals(location.getAddress()) && loc.getRoom().equals(location.getRoom())) {
                return new ResponseEntity<>(
                        new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Lokacija već postoji", "Lokacija sa ovom adresom i prostorijom već postoji"),
                        HttpStatus.BAD_REQUEST);
            }
        }

        Location savedLocation = locationServiceJPA.save(location);
        LocationDTO locationDTO = new LocationDTO(savedLocation.getId(), savedLocation.getAddress(), savedLocation.getRoom());
        return new ResponseEntity<>(locationDTO, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<LocationDTO> locationDTOList = locationServiceJPA.findAll().stream()
                .map(location -> new LocationDTO(location.getId(), location.getAddress(), location.getRoom()))
                .toList();
        return new ResponseEntity<>(locationDTOList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Object> getLocationById(@PathVariable Long id) {
        Location location = locationServiceJPA.findById(id);
        if (location != null) {
            LocationDTO locationDTO = new LocationDTO(location.getId(), location.getAddress(), location.getRoom());
            return new ResponseEntity<>(locationDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Lokacija nije pronađena", "Lokacija sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteLocation(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID lokacije mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        Location location = locationServiceJPA.findById(id);
        if (location != null) {
            locationServiceJPA.deleteById(id);
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno obrisano", "Lokacija obrisana uspješno"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Lokacija nije pronađena", "Lokacija sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID lokacije mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        if (location == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći zahtjev", "Body zahtjeva ne smije biti prazno"),
                    HttpStatus.BAD_REQUEST);
        }

        Location existingLocation = locationServiceJPA.findById(id);
        if (existingLocation != null) {
            if (location.getAddress() != null && !location.getAddress().trim().isEmpty()) {
                existingLocation.setAddress(location.getAddress());
            }
            if (location.getRoom() != null && !location.getRoom().trim().isEmpty()) {
                existingLocation.setRoom(location.getRoom());
            }
            locationServiceJPA.save(existingLocation);
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno ažurirano", "Lokacija ažurirana uspješno"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Lokacija nije pronađena", "Lokacija sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }
    }
}
