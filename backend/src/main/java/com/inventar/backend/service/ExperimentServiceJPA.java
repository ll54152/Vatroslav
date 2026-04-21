package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.DTO.ExperimentAddDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.DTO.FileShowDTO;
import com.inventar.backend.DTO.LogShowDTO;
import com.inventar.backend.DTO.UserShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.Log;
import com.inventar.backend.domain.User;
import com.inventar.backend.mapper.ComponentMapper;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.FileRepo;
import com.inventar.backend.repo.LogRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Service
public class ExperimentServiceJPA {

    private ExperimentRepo experimentRepo;
    private ComponentRepo componentRepo;
    private ComponentServiceJPA componentServiceJPA;
    private LogServiceJPA logServiceJPA;
    private FileServiceJPA fileServiceJPA;
    private AuthenticationServiceJPA authenticationServiceJPA;
    private HttpServletRequest httpServletRequest;
    private final UserServiceJPA userServiceJPA;
    private LogRepo logRepo;
    private FileRepo fileRepo;

    private ComponentMapper componentMapper;


    @Autowired
    public ExperimentServiceJPA(UserServiceJPA userServiceJPA, ExperimentRepo experimentRepo, ComponentRepo componentRepo, ComponentServiceJPA componentServiceJPA, LogServiceJPA logServiceJPA, FileServiceJPA fileServiceJPA, AuthenticationServiceJPA authenticationServiceJPA, HttpServletRequest httpServletRequest, LogRepo logRepo, FileRepo fileRepo, ComponentMapper componentMapper) {
        this.userServiceJPA = userServiceJPA;
        this.experimentRepo = experimentRepo;
        this.componentRepo = componentRepo;
        this.componentServiceJPA = componentServiceJPA;
        this.logServiceJPA = logServiceJPA;
        this.fileServiceJPA = fileServiceJPA;
        this.authenticationServiceJPA = authenticationServiceJPA;
        this.httpServletRequest = httpServletRequest;
        this.logRepo = logRepo;
        this.fileRepo = fileRepo;
        this.componentMapper = componentMapper;
    }

    @Transactional
    public Experiment save(ExperimentAddDTO experimentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        User user = userServiceJPA.getAuthenticatedUser();

        List<Component> componentList = componentServiceJPA.findAllByIds(experimentAddDTO.getComponentIds());

        Experiment experiment = mapDTOtoEntity(experimentAddDTO, componentList);

        experimentRepo.save(experiment);

        logServiceJPA.experimentCreation(experiment, user);

        fileServiceJPA.handleExperimentFiles(experiment, files, profileImage, otherImages, user);

        linkComponentsWithExperiment(experiment, componentList, user);

        return experiment;
    }

    @Transactional
    public void deleteById(Long id) {
        Experiment experiment = experimentRepo.findById(id).orElseThrow(() -> new RuntimeException("Experiment not found"));

        User user = userServiceJPA.getAuthenticatedUser();

        unlinkComponentsFromExperiment(experiment, user);

        logServiceJPA.deleteLogs(experiment.getLogList());

        fileServiceJPA.deleteFiles(experiment.getFileList());

        logServiceJPA.experimentDeletion(experiment, user);

        experimentRepo.deleteById(id);
    }

    @Transactional
    public void deleteByIdOld(Long id) {
        Experiment experiment = experimentRepo.findById(id).orElse(null);

        if (experiment != null) {

            String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));
            User user = userServiceJPA.findByEmail(email);

            if (experiment.getComponentList() != null && !experiment.getComponentList().isEmpty()) {
                List<Component> componentList = experiment.getComponentList();
                for (Component component : componentList) {
                    List<Experiment> experimentList = component.getExperimentList();
                    experimentList.remove(experiment);
                    component.setExperimentList(experimentList);
                    componentRepo.save(component);

                    String componentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio eksperiment '" + experiment.getName() + "' iz komponente '" + component.getName() + "'";
                    logRepo.save(new Log(component, componentNote, LocalDateTime.now(), user));
                }
            }

            if (experiment.getLogList() != null && !experiment.getLogList().isEmpty()) {
                List<Log> experimentLogList = experiment.getLogList();
                for (Log experimentLog : experimentLogList) {
                    logRepo.deleteById(experimentLog.getId());
                }
            }

            if (experiment.getFileList() != null && !experiment.getFileList().isEmpty()) {
                List<File> fileList = experiment.getFileList();
                for (File file : fileList) {
                    fileRepo.deleteById(file.getId());
                }
            }

            experimentRepo.deleteById(id);
        }
    }

    public ExperimentShowDTO getShowDTO(Experiment experiment) {
        if (experiment == null) {
            return null;
        } else {
            ExperimentShowDTO experimentShowDTO = new ExperimentShowDTO();
            experimentShowDTO.setId(experiment.getId());
            experimentShowDTO.setName(experiment.getName());
            experimentShowDTO.setZpf(experiment.getZpf());
            experimentShowDTO.setField(experiment.getField());
            experimentShowDTO.setSubject(experiment.getSubject());
            experimentShowDTO.setDescription(experiment.getDescription());
            experimentShowDTO.setKeywords(experiment.getKeywords());
            experimentShowDTO.setMaterials(experiment.getMaterials());

            experimentShowDTO.setComponentDTOList(componentMapper.mapComponentsToDTOs(experiment.getComponentList()));
            experimentShowDTO.setLogShowDTOList(logServiceJPA.mapLogsToDTOs(experiment.getLogList()));
            experimentShowDTO.setFileShowDTOList(fileServiceJPA.mapFilesToDTOs(experiment.getFileList()));

            return experimentShowDTO;
        }
    }

    public ExperimentShowDTO getShowDTOOld(Experiment experiment) {
        ExperimentShowDTO experimentShowDTO = new ExperimentShowDTO();
        experimentShowDTO.setId(experiment.getId());
        experimentShowDTO.setName(experiment.getName());
        experimentShowDTO.setZpf(experiment.getZpf());
        experimentShowDTO.setField(experiment.getField());
        experimentShowDTO.setSubject(experiment.getSubject());
        experimentShowDTO.setDescription(experiment.getDescription());
        experimentShowDTO.setKeywords(experiment.getKeywords());
        experimentShowDTO.setMaterials(experiment.getMaterials());


        if (experiment.getComponentList() != null) {
            List<ComponentShowDTO> componentShowDTOList = new ArrayList<>();
            for (Component component : experiment.getComponentList()) {
                ComponentShowDTO componentShowDTO = new ComponentShowDTO();
                componentShowDTO.setId(component.getId());
                componentShowDTO.setName(component.getName());
                componentShowDTO.setDescription(component.getDescription());
                componentShowDTO.setKeywords(component.getKeywords());
                componentShowDTO.setZpf(component.getZpf());
                componentShowDTO.setFer(component.getFer());
                componentShowDTO.setQuantity(component.getQuantity());
                componentShowDTOList.add(componentShowDTO);
            }

            //experimentShowDTO.setComponentShowDTOList(componentShowDTOList);
        }


        if (experiment.getLogList() != null) {
            List<LogShowDTO> logShowDTOList = new ArrayList<>();
            for (Log log : experiment.getLogList()) {
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

            experimentShowDTO.setLogShowDTOList(logShowDTOList);
        }


        if (experiment.getFileList() != null) {
            List<FileShowDTO> fileShowDTOList = new ArrayList<>();
            for (File file : experiment.getFileList()) {
                FileShowDTO fileShowDTO = new FileShowDTO();
                fileShowDTO.setId(file.getId());
                fileShowDTO.setName(file.getName());
                fileShowDTO.setFileCategory(file.getFileCategory());
                fileShowDTO.setFileByte(Base64.getEncoder().encodeToString(file.getFileByte()));
                fileShowDTOList.add(fileShowDTO);
            }

            experimentShowDTO.setFileShowDTOList(fileShowDTOList);
        }


        return experimentShowDTO;
    }

    public String update(Long id, ExperimentAddDTO experimentAddDTO, List<String> componentList, List<String> logList, List<Long> deletedFilesList, List<FileDTO> fileDTOList) {

        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));
        User user = userServiceJPA.findByEmail(email);

        LocalDateTime timestamp = LocalDateTime.now();

        Experiment experiment = experimentRepo.findById(id).orElse(null);

        if (experimentAddDTO.getName() != null) {
            experiment.setName(experimentAddDTO.getName());
        }

        if (experimentAddDTO.getField() != null) {
            experiment.setField(experimentAddDTO.getField());
        }

        if (experimentAddDTO.getSubject() != null) {
            experiment.setSubject(experimentAddDTO.getSubject());
        }

        if (experimentAddDTO.getDescription() != null) {
            experiment.setDescription(experimentAddDTO.getDescription());
        }

        if (experimentAddDTO.getMaterials() != null) {
            experiment.setMaterials(experimentAddDTO.getMaterials());
        }


        List<Log> logsForDelete = new ArrayList<>();
        for (Log log : experiment.getLogList()) {
            if (logList != null && !logList.isEmpty()) {
                boolean found = false;
                for (String logId : logList) {
                    if (log.getId().toString().equals(logId)) {
                        found = true;
                    }
                }
                if (!found) {
                    logsForDelete.add(log);
                }
            } else {
                logsForDelete.add(log);
            }
        }

        for (Log log : logsForDelete) {
            logRepo.deleteById(log.getId());
            experiment.getLogList().remove(log);
        }


        List<Component> newComponentList = new ArrayList<>();
        List<Component> oldComponentList = experiment.getComponentList();
        for (String componentId : componentList) {
            Component component = componentRepo.findById(Long.valueOf(componentId)).orElse(null);
            if (component != null) {
                newComponentList.add(component);
            }
        }
        experiment.setComponentList(newComponentList);

        for (Component component : oldComponentList) {
            if (!newComponentList.contains(component)) {
                List<Experiment> experimentList = component.getExperimentList();
                experimentList.remove(experiment);
                component.setExperimentList(experimentList);
                componentRepo.save(component);

                String componentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio eksperiment '" + experiment.getName() + "' iz komponente '" + component.getName() + "'";
                logRepo.save(new Log(component, componentNote, timestamp, user));
                logRepo.save(new Log(experiment, componentNote, timestamp, user));
            }
        }

        for (Component component : newComponentList) {
            if (!oldComponentList.contains(component)) {
                List<Experiment> experimentList = component.getExperimentList();
                experimentList.add(experiment);
                component.setExperimentList(experimentList);
                componentRepo.save(component);

                String componentNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je povezao eksperiment '" + experiment.getName() + "' sa komponentom '" + component.getName() + "'";
                logRepo.save(new Log(component, componentNote, timestamp, user));
                logRepo.save(new Log(experiment, componentNote, timestamp, user));
            }
        }


        if (deletedFilesList != null && !deletedFilesList.isEmpty()) {
            for (Long fileId : deletedFilesList) {
                File file = fileRepo.findById(fileId).orElse(null);
                if (file != null) {
                    String fileNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio datoteku '" + file.getName() + "' iz eksperimenta '" + experiment.getName() + "'";
                    logRepo.save(new Log(experiment, fileNote, timestamp, user));
                    fileRepo.deleteById(fileId);
                }
            }
        }

        if (!logsForDelete.isEmpty()) {
            for (Log log : logsForDelete) {
                String noteLog = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je uklonio log '" + log.getNote() + "' iz eksperimenta '" + experiment.getName() + "'";
                logRepo.save(new Log(experiment, noteLog, timestamp, user));
            }
        }


        if (fileDTOList != null && !fileDTOList.isEmpty()) {
            for (FileDTO fileDTO : fileDTOList) {
                File file = new File();
                file.setName(fileDTO.getName());
                file.setExperiment(experiment);
                file.setFileType(fileDTO.getData().getContentType());
                file.setFileCategory(fileDTO.getFileCategory());
                file.setUser(user);
                try {
                    file.setFileByte(fileDTO.getData().getBytes());
                    String fileNote = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je dodao datoteku '" + file.getName() + "' u eksperiment '" + experiment.getName() + "'";
                    logRepo.save(new Log(experiment, fileNote, timestamp, user));
                    fileRepo.save(file);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        String note = "Korisnik '" + user.getFirstName() + " " + user.getLastName() + "' je ažurirao eksperiment '" + experiment.getName() + "'";
        logRepo.save(new Log(experiment, note, timestamp, user));
        experimentRepo.save(experiment);

        return "Upješno ažuriran eksperiment";
    }

    private void linkComponentsWithExperiment(Experiment experiment, List<Component> componentList, User user) {
        if (componentList != null) {
            for (Component component : componentList) {
                component.getExperimentList().add(experiment);

                componentRepo.save(component);

                logServiceJPA.linkComponentAndExperiment(component, experiment, user);
            }
        }
    }

    private void unlinkComponentsFromExperiment(Experiment experiment, User user) {
        if (experiment.getComponentList() != null) {

            List<Component> componentsToUnlink = new ArrayList<>(experiment.getComponentList());

            for (Component component : componentsToUnlink) {
                component.getExperimentList().remove(experiment);
                experiment.getComponentList().remove(component);

                componentRepo.save(component);
                experimentRepo.save(experiment);

                logServiceJPA.unlinkComponentFromExperiment(component, experiment, user);
            }
        }
    }

    private Experiment mapDTOtoEntity(ExperimentAddDTO experimentAddDTO, List<Component> componentList) {
        if (experimentRepo.findByZpf(experimentAddDTO.getZpf()).isPresent()) {
            throw new RuntimeException("Experiment with same ZPF already exists");
        }

        Experiment experiment = new Experiment(
                experimentAddDTO.getName(),
                experimentAddDTO.getZpf(),
                experimentAddDTO.getField(),
                experimentAddDTO.getSubject(),
                experimentAddDTO.getDescription(),
                experimentAddDTO.getKeywords(),
                experimentAddDTO.getMaterials()
        );

        if (componentList != null && !componentList.isEmpty()) {
            experiment.setComponentList(componentList);
        }

        return experiment;
    }

    public List<Experiment> findAll() {
        return experimentRepo.findAll();
    }

    public Experiment findById(Long id) {
        return experimentRepo.findById(id).orElse(null);
    }

    public List<Experiment> findAllByIds(List<Long> experimentIds) {
        if (experimentIds == null) {
            return List.of();
        } else {
            List<Experiment> experimentList = new ArrayList<>();
            for (Long experimentId : experimentIds) {
                experimentRepo.findById(experimentId).ifPresent(experimentList::add);
            }
            return experimentList;
        }
    }

    public void quickSave(Experiment experiment) {
        experimentRepo.save(experiment);
    }
}
