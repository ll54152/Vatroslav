package com.inventar.backend.service;

import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.util.*;

@Service
public class LocationServiceJPA {

    @Autowired
    private LocationRepo locationRepo;

    public Location save(Location location) {
        return locationRepo.save(location);
    }

    public Location findById(Long id) {
        return locationRepo.findById(id).orElse(null);
    }

    public Location findByAdress(String adress) {
        return locationRepo.findByAdress(adress).orElse(null);
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