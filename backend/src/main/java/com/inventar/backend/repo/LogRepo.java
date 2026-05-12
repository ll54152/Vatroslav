package com.inventar.backend.repo;

import com.inventar.backend.domain.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepo extends JpaRepository<Log, Long> {
}
