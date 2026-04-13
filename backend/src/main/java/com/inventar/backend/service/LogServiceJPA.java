package com.inventar.backend.service;

import com.inventar.backend.DTO.LogAddDTO;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.Log;
import com.inventar.backend.domain.Component;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.LogRepo;
import com.inventar.backend.repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LogServiceJPA {

    private AuthenticationServiceJPA authenticationServiceJPA;
    private LogRepo logRepo;
    private UserRepo userRepo;
    private HttpServletRequest httpServletRequest;
    private ExperimentRepo experimentRepo;
    private ComponentRepo componentRepo;

    @Autowired
    public LogServiceJPA(AuthenticationServiceJPA authenticationServiceJPA, LogRepo logRepo, UserRepo userRepo, HttpServletRequest httpServletRequest, ExperimentRepo experimentRepo, ComponentRepo componentRepo) {
        this.authenticationServiceJPA = authenticationServiceJPA;
        this.logRepo = logRepo;
        this.userRepo = userRepo;
        this.httpServletRequest = httpServletRequest;
        this.experimentRepo = experimentRepo;
        this.componentRepo = componentRepo;
    }

    public Log save(LogAddDTO logAddDTO) {
        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));

        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(userRepo.findByEmail(email).get());
        log.setNote(logAddDTO.getNote());

        if (logAddDTO.getEntityType().equals("eksperiment")) {
            Optional<Experiment> experiment = experimentRepo.findById(logAddDTO.getEntityId());
            log.setExperiment(experiment.get());
        } else if (logAddDTO.getEntityType().equals("komponenta")) {
            Optional<Component> component = componentRepo.findById(logAddDTO.getEntityId());
            log.setComponent(component.get());
        }

        return logRepo.save(log);
    }

    public List<Log> findAll() {
        return logRepo.findAll();
    }

    public Log findById(Long id) {
        return logRepo.findById(id).orElse(null);
    }

    public List<Log> findByExperimentId(Long experimentId) {
        List<Log> logs = logRepo.findAll();
        return logs.stream()
                .filter(log -> log.getExperiment().getId().equals(experimentId))
                .toList();
    }

    public List<Log> findByComponentId(Long componentId) {
        List<Log> logs = logRepo.findAll();
        return logs.stream()
                .filter(log -> log.getComponent().getId().equals(componentId))
                .toList();
    }

    public void deleteById(Long id) {
        logRepo.deleteById(id);
    }
}
