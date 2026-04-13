package com.inventar.backend.repo;

import com.inventar.backend.domain.Experiment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperimentRepo extends JpaRepository<Experiment, Long> {
}
