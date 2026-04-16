package com.inventar.backend.service;

import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.domain.Location;
import com.inventar.backend.repo.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceJPA {

    private final LocationRepo locationRepo;

    @Autowired
    public LocationServiceJPA(LocationRepo locationRepo) {
        this.locationRepo = locationRepo;
    }

    public Location save(Location location) {
        return locationRepo.save(location);
    }

    public Location findById(Long id) {
        return locationRepo.findById(id).orElse(null);
    }

    public LocationDTO mapLocationToDTO(Location location) {
        if (location == null) {
            return null;
        } else {
            LocationDTO locationDTO = new LocationDTO();

            if (location.getId() != null) {
                locationDTO.setId(location.getId());
            }

            if (location.getAddress() != null) {
                locationDTO.setAddress(location.getAddress());
            }

            if (location.getRoom() != null) {
                locationDTO.setRoom(location.getRoom());
            }

            return locationDTO;
        }
    }

    public Location findByAddress(String address) {
        return locationRepo.findByAddress(address).orElse(null);
    }

    public Location findByRoom(String room) {
        return locationRepo.findByRoom(room).orElse(null);
    }

    public List<Location> findAll() {
        return locationRepo.findAll();
    }

    public void deleteById(Long id) {
        locationRepo.deleteById(id);
    }
}