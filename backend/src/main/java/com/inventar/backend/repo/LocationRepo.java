package com.inventar.backend.repo;

import com.inventar.backend.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepo extends JpaRepository<Location, Long> {
}