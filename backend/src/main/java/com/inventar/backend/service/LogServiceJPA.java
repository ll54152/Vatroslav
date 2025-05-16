package com.inventar.backend.service;

import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogServiceJPA {

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private LogRepo logRepo;

    @Autowired
    private UserServiceJPA userServiceJPA;

    @Autowired
    private HttpServletRequest request;

    public Log save(Log log) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));

        log.setTimestamp(LocalDateTime.now());
        log.setUser(userServiceJPA.findByEmail(email));

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
