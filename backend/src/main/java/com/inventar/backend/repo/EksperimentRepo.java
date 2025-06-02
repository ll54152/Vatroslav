package com.inventar.backend.repo;

import com.inventar.backend.domain.*;
import org.springframework.data.jpa.repository.*;

public interface EksperimentRepo extends JpaRepository<Eksperiment, Long> {
}
