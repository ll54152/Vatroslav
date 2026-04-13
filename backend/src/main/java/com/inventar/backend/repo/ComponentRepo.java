package com.inventar.backend.repo;

import com.inventar.backend.domain.Component;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComponentRepo extends JpaRepository<Component, Long> {
    Optional<Component> findByZpf(String zpf);

    Optional<Component> findById(Long id);
}