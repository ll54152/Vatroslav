package com.inventar.backend.controller;

import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.domain.Location;
import com.inventar.backend.service.LocationServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private LocationServiceJPA locationServiceJPA;

    @Autowired
    public LocationController(LocationServiceJPA locationServiceJPA) {
        this.locationServiceJPA = locationServiceJPA;
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addLocation(@RequestBody Location location) {
        List<Location> locationList = locationServiceJPA.findAll();

        for (Location loc : locationList) {
            if (loc.getAddress().equals(location.getAddress()) && loc.getRoom().equals(location.getRoom())) {
                return new ResponseEntity<>("Lokacija već postoji", HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable Long id) {
        Location location = locationServiceJPA.findById(id);
        if (location != null) {
            LocationDTO locationDTO = new LocationDTO(location.getId(), location.getAddress(), location.getRoom());
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
            if (location.getAddress() != null && !location.getAddress().isEmpty()) {
                existingLocation.setAddress(location.getAddress());
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
