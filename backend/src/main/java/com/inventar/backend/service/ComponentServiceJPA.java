package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.DTO.FileShowDTO;
import com.inventar.backend.DTO.LocationDTO;
import com.inventar.backend.DTO.LogShowDTO;
import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.Log;
import com.inventar.backend.domain.User;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.Location;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.FileRepo;
import com.inventar.backend.repo.LocationRepo;
import com.inventar.backend.repo.LogRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ComponentServiceJPA {

    private ComponentRepo componentRepo;
    private LocationRepo locationRepo;
    private ExperimentRepo experimentRepo;
    private AuthenticationServiceJPA authenticationServiceJPA;
    private HttpServletRequest httpServletRequest;
    private UserServiceJPA userServiceJPA;
    private LogRepo logRepo;
    private FileRepo fileRepo;


    @Autowired
    public ComponentServiceJPA(ComponentRepo componentRepo, LocationRepo locationRepo, ExperimentRepo experimentRepo, AuthenticationServiceJPA authenticationServiceJPA, HttpServletRequest httpServletRequest, UserServiceJPA userServiceJPA, LogRepo logRepo, FileRepo fileRepo) {
        this.componentRepo = componentRepo;
        this.locationRepo = locationRepo;
        this.experimentRepo = experimentRepo;
        this.authenticationServiceJPA = authenticationServiceJPA;
        this.httpServletRequest = httpServletRequest;
        this.userServiceJPA = userServiceJPA;
        this.logRepo = logRepo;
        this.fileRepo = fileRepo;
    }

    public Component save(ComponentAddDTO componentAddDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));
        User user = userServiceJPA.findByEmail(email);
        String componentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao komponentu '" + componentAddDTO.getName() + "' u bazu podataka";

        LocalDateTime timestamp = LocalDateTime.now();

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElse(null);

        List<Experiment> experimentList = new ArrayList<>();
        if (componentAddDTO.getExperimentDTOList() != null) {
            for (ExperimentDTO experimentDTO : componentAddDTO.getExperimentDTOList()) {
                if (experimentDTO.getId() != null) {
                    Experiment existingExperiment = experimentRepo.findById(experimentDTO.getId()).orElse(null);
                    if (existingExperiment != null) {
                        experimentList.add(existingExperiment);
                    }
                }
            }
        }

        Component component = new Component(
                componentAddDTO.getName()
                , componentAddDTO.getZpf()
                , componentAddDTO.getFer()
                , componentAddDTO.getQuantity()
                , componentAddDTO.getDescription()
                , componentAddDTO.getKeywords()
                , location
        );

        if (!experimentList.isEmpty()) {
            component.setExperimentList(experimentList);
        }

        componentRepo.save(component);

        logRepo.save(new Log(component, componentNote, timestamp, user));

        if (componentAddDTO.getFileDTOList() != null) {
            for (FileDTO fileDTO : componentAddDTO.getFileDTOList()) {
                File file = new File();
                file.setName(fileDTO.getName());
                file.setComponent(component);
                file.setFileType(fileDTO.getData().getContentType());
                file.setFileCategory(fileDTO.getFileCategory());
                file.setUser(user);
                try {
                    file.setFileByte(fileDTO.getData().getBytes());
                    fileRepo.save(file);

                    String fileNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao datoteku '" + file.getName() + "' u komponentu '" + component.getName() + "'";
                    logRepo.save(new Log(component, fileNote, timestamp, user));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        for (Experiment experiment : experimentList) {
            List<Component> componentList = experiment.getComponentList();
            componentList.add(component);
            experiment.setComponentList(componentList);

            String componentExperimentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao komponentu '" + component.getName() + "' sa eksperimentom '" + experiment.getName() + "'";
            logRepo.save(new Log(component, componentExperimentNote, timestamp, user));
            logRepo.save(new Log(experiment, componentExperimentNote, timestamp, user));

            experimentRepo.save(experiment);
        }

        return component;
    }

    public Component findByZpf(String zpf) {
        return componentRepo.findByZpf(zpf).orElse(null);
    }

    public Component findById(Long id) {
        return componentRepo.findById(id).orElse(null);
    }

    public List<Component> findAll() {
        return componentRepo.findAll();
    }

    public void deleteById(Long id) {
        Component component = componentRepo.findById(id).orElse(null);

        if (component != null) {

            String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));
            User user = userServiceJPA.findByEmail(email);

            if (!component.getExperimentList().isEmpty() && component.getExperimentList() != null) {
                List<Experiment> experimentList = component.getExperimentList();
                for (Experiment experiment : experimentList) {
                    List<Component> componentList = experiment.getComponentList();
                    componentList.remove(component);
                    experiment.setComponentList(componentList);
                    experimentRepo.save(experiment);

                    String experimentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio komponentu '" + component.getName() + "' iz eksperimenta '" + experiment.getName() + "'";
                    logRepo.save(new Log(experiment, experimentNote, LocalDateTime.now(), user));
                }
            }

            if (!component.getLogList().isEmpty() && component.getLogList() != null) {
                List<Log> experimentLogList = component.getLogList();
                for (Log log : experimentLogList) {
                    logRepo.deleteById(log.getId());
                }
            }

            if (!component.getFileList().isEmpty() && component.getFileList() != null) {
                List<File> experimentFileList = component.getFileList();
                for (File file : experimentFileList) {
                    fileRepo.deleteById(file.getId());
                }
            }

            componentRepo.deleteById(id);
        }
    }

    public ComponentShowDTO getShowDTO(Component component) {
        ComponentShowDTO componentShowDTO = new ComponentShowDTO();
        componentShowDTO.setId(component.getId());
        componentShowDTO.setFer(component.getFer());
        componentShowDTO.setZpf(component.getZpf());
        componentShowDTO.setName(component.getName());
        componentShowDTO.setDescription(component.getDescription());
        componentShowDTO.setKeywords(component.getKeywords());
        componentShowDTO.setQuantity(component.getQuantity());

        if (component.getLocation() != null) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setId(component.getLocation().getId());
            locationDTO.setAddress(component.getLocation().getAddress());
            locationDTO.setRoom(component.getLocation().getRoom());
            componentShowDTO.setLocationDTO(locationDTO);
        }

        if (component.getExperimentList() != null) {
            List<ExperimentShowDTO> eksperimentShowDTOList = new ArrayList<>();
            for (Experiment experiment : component.getExperimentList()) {
                ExperimentShowDTO experimentShowDTO = new ExperimentShowDTO();
                experimentShowDTO.setId(experiment.getId());
                experimentShowDTO.setName(experiment.getName());
                experimentShowDTO.setField(experiment.getField());
                experimentShowDTO.setSubject(experiment.getSubject());
                experimentShowDTO.setDescription(experiment.getDescription());
                experimentShowDTO.setMaterials(experiment.getMaterials());
                eksperimentShowDTOList.add(experimentShowDTO);
            }

            componentShowDTO.setExperimentShowDTOList(eksperimentShowDTOList);
        }

        if (component.getLogList() != null) {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();
            for (Log log : component.getLogList()) {
                LogShowDTO logShowDTO = new LogShowDTO();
                logShowDTO.setId(log.getId());
                logShowDTO.setNote(log.getNote());
                logShowDTO.setTimestamp(log.getTimestamp());

                if (log.getUser() != null) {
                    UserShowDTO userShowDTO = new UserShowDTO();
                    userShowDTO.setEmail(log.getUser().getEmail());
                    userShowDTO.setFirstName(log.getUser().getFirstName());
                    userShowDTO.setLastName(log.getUser().getLastName());
                    logShowDTO.setUserShowDTO(userShowDTO);
                }
                logShowDTOList.add(logShowDTO);
            }

            componentShowDTO.setLogShowDTOListw(logShowDTOList);
        }

        if (component.getFileList() != null) {
            List<FileShowDTO> fileShowDTOList = new ArrayList<>();
            for (File file : component.getFileList()) {
                FileShowDTO fileShowDTO = new FileShowDTO();
                fileShowDTO.setId(file.getId());
                fileShowDTO.setName(file.getName());
                fileShowDTO.setFileCategory(file.getFileCategory());
                fileShowDTO.setFileByte(Base64.getEncoder().encodeToString(file.getFileByte()));
                fileShowDTOList.add(fileShowDTO);
            }

            componentShowDTO.setFileShowDTOList(fileShowDTOList);
        }

        return componentShowDTO;
    }
}
