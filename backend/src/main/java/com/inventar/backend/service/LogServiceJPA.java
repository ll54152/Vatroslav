package com.inventar.backend.service;

import com.inventar.backend.DTO.LogAddDTO;
import com.inventar.backend.DTO.LogShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.Log;
import com.inventar.backend.domain.User;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.LogRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LogServiceJPA {

    private final UserServiceJPA userServiceJPA;

    private final ComponentRepo componentRepo;
    private final ExperimentRepo experimentRepo;
    private final LogRepo logRepo;

    @Autowired
    public LogServiceJPA(UserServiceJPA userServiceJPA, ComponentRepo componentRepo, ExperimentRepo experimentRepo, LogRepo logRepo) {
        this.userServiceJPA = userServiceJPA;
        this.componentRepo = componentRepo;
        this.experimentRepo = experimentRepo;
        this.logRepo = logRepo;
    }

    @Transactional
    public void linkComponentAndExperiment(Component component, Experiment experiment, User user) {
        Log componentLog = new Log();
        componentLog.setTimestamp(LocalDateTime.now());
        componentLog.setUser(user);
        componentLog.setComponent(component);
        componentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao komponentu '" + component.getName() + "' sa eksperimentom '" + experiment.getName() + "'");
        logRepo.save(componentLog);

        Log experimentLog = new Log();
        experimentLog.setTimestamp(LocalDateTime.now());
        experimentLog.setUser(user);
        experimentLog.setExperiment(experiment);
        experimentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao komponentu '" + component.getName() + "' sa eksperimentom '" + experiment.getName() + "'");
        logRepo.save(experimentLog);
    }

    @Transactional
    public void unlinkComponentFromExperiment(Component component, Experiment experiment, User user) {
        Log componentLog = new Log();
        componentLog.setTimestamp(LocalDateTime.now());
        componentLog.setUser(user);
        componentLog.setComponent(component);
        componentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio eksperiment '" + experiment.getName() + "' iz komponente '" + component.getName() + "'");
        logRepo.save(componentLog);

        Log experimentLog = new Log();
        experimentLog.setTimestamp(LocalDateTime.now());
        experimentLog.setUser(user);
        experimentLog.setExperiment(null);
        experimentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio komponentu '" + component.getName() + "' iz eksperimenta '" + experiment.getName() + "'");
        logRepo.save(experimentLog);
    }

    @Transactional
    public void unlinkExperimentFromComponent(Experiment experiment, Component component, User user) {
        Log componentLog = new Log();
        componentLog.setTimestamp(LocalDateTime.now());
        componentLog.setUser(user);
        componentLog.setComponent(null);
        componentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio eksperiment '" + experiment.getName() + "' iz komponente '" + component.getName() + "'");
        logRepo.save(componentLog);

        Log experimentLog = new Log();
        experimentLog.setTimestamp(LocalDateTime.now());
        experimentLog.setUser(user);
        experimentLog.setExperiment(experiment);
        experimentLog.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio komponentu '" + component.getName() + "' iz eksperimenta '" + experiment.getName() + "'");
        logRepo.save(experimentLog);
    }

    @Transactional
    public void componentCreation(Component component, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setComponent(component);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao komponentu '" + component.getName() + "' u bazu podataka");
        logRepo.save(log);
    }

    @Transactional
    public void componentDeletion(Component component, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setComponent(null);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio komponentu '" + component.getName() + "' iz baze podataka");
        logRepo.save(log);
    }

    @Transactional
    public void componentUpdated(Component component, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setComponent(component);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je ažurirao komponentu '" + component.getName() + "' u bazi podataka");
        logRepo.save(log);
    }

    @Transactional
    public void fileComponentCreation(Component component, File file, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setComponent(component);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao datoteku '" + file.getName() + "' u komponentu '" + component.getName() + "'");
        logRepo.save(log);
    }

    @Transactional
    public void fileComponentDeletion(Component component, File file, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setComponent(component);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je izbrisao datoteku '" + file.getName() + "' iz komponente '" + component.getName() + "'");
        logRepo.save(log);
    }

    @Transactional
    public void fileExperimentDeletion(Experiment experiment, File file, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setExperiment(experiment);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je izbrisao datoteku '" + file.getName() + "' iz eksperimenta '" + experiment.getName() + "'");
        logRepo.save(log);
    }

    @Transactional
    public void experimentCreation(Experiment experiment, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setExperiment(experiment);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao eksperiment '" + experiment.getName() + "' u bazu podataka");
        logRepo.save(log);
    }

    @Transactional
    public void experimentUpdated(Experiment experiment, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setExperiment(experiment);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je ažurirao eksperiment '" + experiment.getName() + "' u bazi podataka");
        logRepo.save(log);
    }

    @Transactional
    public void experimentDeletion(Experiment experiment, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setExperiment(null);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio eksperiment '" + experiment.getName() + "' iz baze podataka");
        logRepo.save(log);
    }

    @Transactional
    public void fileExperimentCreation(Experiment experiment, File file, User user) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(user);
        log.setExperiment(experiment);
        log.setNote("Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao datoteku '" + file.getName() + "' u eksperiment '" + experiment.getName() + "'");
        logRepo.save(log);
    }

    @Transactional
    public Log save(LogAddDTO logAddDTO) {
        Log log = new Log();
        log.setTimestamp(LocalDateTime.now());
        log.setUser(userServiceJPA.getAuthenticatedUser());
        log.setNote(logAddDTO.getNote());

        if (logAddDTO.getEntityType().equals("experiment")) {
            log.setExperiment(experimentRepo.findById(logAddDTO.getEntityId()).orElseThrow(() -> new RuntimeException("Experiment not found")));
        } else if (logAddDTO.getEntityType().equals("component")) {
            log.setComponent(componentRepo.findById(logAddDTO.getEntityId()).orElseThrow(() -> new RuntimeException("Component not found")));
        }

        return logRepo.save(log);
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

    @Transactional
    public void deleteById(Long id) {
        logRepo.deleteById(id);
    }

    public List<LogShowDTO> mapLogsToDTOs(List<Log> logList) {
        if (logList == null) {
            return List.of();
        } else {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();

            for (Log log : logList) {
                LogShowDTO logShowDTO = new LogShowDTO();
                logShowDTO.setId(log.getId());
                logShowDTO.setNote(log.getNote());
                logShowDTO.setTimestamp(log.getTimestamp());
                logShowDTO.setUserShowDTO(userServiceJPA.mapUserToDTO(log.getUser()));

                logShowDTOList.add(logShowDTO);
            }

            return logShowDTOList;
        }
    }

    @Transactional
    public void deleteLogs(List<Log> logList) {
        if (logList != null && !logList.isEmpty()) {
            logRepo.deleteAll(logList);
        }
    }

    public List<Log> findAll() {
        return logRepo.findAll();
    }

    public Log findById(Long id) {
        return logRepo.findById(id).orElse(null);
    }

    public void quickSave(Log log) {
        logRepo.save(log);
    }
}
