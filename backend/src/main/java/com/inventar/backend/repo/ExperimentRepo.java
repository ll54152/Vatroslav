package com.inventar.backend.repo;

import com.inventar.backend.domain.Experiment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExperimentRepo extends JpaRepository<Experiment, Long> {
    Optional<Experiment> findByZpf(String zpf);
}
