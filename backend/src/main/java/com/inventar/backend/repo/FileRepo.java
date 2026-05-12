package com.inventar.backend.repo;

import com.inventar.backend.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepo extends JpaRepository<File, Long> {
}
