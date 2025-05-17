package com.inventar.backend.service;

import com.inventar.backend.DTO.LogAddDTO;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LogServiceJPA {

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private LogRepo logRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private EksperimentRepo eksperimentRepo;

    @Autowired
    private KomponentaRepo komponentaRepo;

    public Log save(LogAddDTO logAddDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));

        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(userRepo.findByEmail(email).get());
        log.setNote(logAddDTO.getNote());

        if (logAddDTO.getEntityType().equals("eksperiment")) {
            Optional<Eksperiment> eksperiment = eksperimentRepo.findById(logAddDTO.getEntityId());
            log.setEksperiment(eksperiment.get());
        } else if (logAddDTO.getEntityType().equals("komponenta")) {
            Optional<Komponenta> komponenta = komponentaRepo.findById(logAddDTO.getEntityId());
            log.setKomponenta(komponenta.get());
        }

        return logRepo.save(log);
    }

    public List<Log> findAll() {
        return logRepo.findAll();
    }

    public Log findById(Long id) {
        return logRepo.findById(id).orElse(null);
    }

    public List<Log> findByEksperimentId(Long eksperimentId) {
        List<Log> logs = logRepo.findAll();
        return logs.stream()
                .filter(log -> log.getEksperiment().getId().equals(eksperimentId))
                .toList();
    }

    public List<Log> findByKomponentaId(int komponentaId) {
        List<Log> logs = logRepo.findAll();
        return logs.stream()
                .filter(log -> log.getKomponenta().getId().equals(komponentaId))
                .toList();
    }

    public void deleteById(Long id) {
        logRepo.deleteById(id);
    }
}
