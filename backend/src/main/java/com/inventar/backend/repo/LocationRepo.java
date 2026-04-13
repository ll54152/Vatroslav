package com.inventar.backend.repo;

import com.inventar.backend.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepo extends JpaRepository<Location, Long> {
    Optional<Location> findByAddress(String address);

    Optional<Location> findByRoom(String room);

    Optional<Location> findById(Long id);

    List<Location> findAll();
}