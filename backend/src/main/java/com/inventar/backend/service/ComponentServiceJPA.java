package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.Location;
import com.inventar.backend.domain.User;
import com.inventar.backend.mapper.ExperimentMapper;
import com.inventar.backend.mapper.LocationMapper;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.LocationRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComponentServiceJPA {

    private final ComponentRepo componentRepo;

    private final ExperimentRepo experimentRepo;
    private final ExperimentMapper experimentMapper;

    private final UserServiceJPA userServiceJPA;

    private final LocationMapper locationMapper;
    private final LocationRepo locationRepo;

    private final LogServiceJPA logServiceJPA;
    private final FileServiceJPA fileServiceJPA;

    @Autowired
    public ComponentServiceJPA(ComponentRepo componentRepo, ExperimentRepo experimentRepo, ExperimentMapper experimentMapper, UserServiceJPA userServiceJPA, LocationMapper locationMapper, LocationRepo locationRepo, LogServiceJPA logServiceJPA, FileServiceJPA fileServiceJPA) {
        this.componentRepo = componentRepo;
        this.experimentRepo = experimentRepo;
        this.experimentMapper = experimentMapper;
        this.userServiceJPA = userServiceJPA;
        this.locationMapper = locationMapper;
        this.locationRepo = locationRepo;
        this.logServiceJPA = logServiceJPA;
        this.fileServiceJPA = fileServiceJPA;
    }

    @Transactional
    public Component save(ComponentAddDTO componentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        User user = userServiceJPA.getAuthenticatedUser();

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElseThrow(() -> new RuntimeException("Location not found"));

        List<Experiment> experimentList = experimentRepo.findAllById(componentAddDTO.getExperimentIds());

        Component component = mapDTOtoEntity(componentAddDTO, location, experimentList);

        componentRepo.save(component);

        logServiceJPA.componentCreation(component, user);

        fileServiceJPA.handleComponentFiles(component, files, profileImage, otherImages, user);

        linkExperimentsWithComponent(component, experimentList, user);

        return component;
    }

    @Transactional
    public void update(Long id, ComponentAddDTO componentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        User user = userServiceJPA.getAuthenticatedUser();

        Component component = componentRepo.findById(id).orElseThrow(() -> new RuntimeException("Component not found"));

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElseThrow(() -> new RuntimeException("Location not found"));

        List<Experiment> newExperiments = experimentRepo.findAllById(componentAddDTO.getExperimentIds());

        updateBasicFields(component, componentAddDTO, location);

        syncExperimentsWithComponent(component, newExperiments, user);

        List<Long> existingFileIds = component.getFileList() != null
                ? component.getFileList().stream().map(File::getId).toList()
                : new ArrayList<>();

        fileServiceJPA.syncComponentFiles(component, existingFileIds, files, profileImage, otherImages, user);

        logServiceJPA.componentUpdated(component, user);

        componentRepo.save(component);
    }

    private void syncExperimentsWithComponent(Component component, List<Experiment> newExperiments, User user) {

        List<Experiment> currentExperiments = component.getExperimentList() != null
                ? component.getExperimentList()
                : new ArrayList<>();

        for (Experiment oldExperiment : new ArrayList<>(currentExperiments)) {
            if (!newExperiments.contains(oldExperiment)) {

                oldExperiment.getComponentList().remove(component);
                experimentRepo.save(oldExperiment);

                logServiceJPA.unlinkComponentFromExperiment(component, oldExperiment, user);
            }
        }

        for (Experiment newExperiment : newExperiments) {
            if (!currentExperiments.contains(newExperiment)) {

                newExperiment.getComponentList().add(component);
                experimentRepo.save(newExperiment);

                logServiceJPA.linkComponentAndExperiment(component, newExperiment, user);
            }
        }

        component.setExperimentList(newExperiments);
    }

    private void updateBasicFields(Component component, ComponentAddDTO componentAddDTO, Location location) {

        component.setName(componentAddDTO.getName());
        component.setQuantity(componentAddDTO.getQuantity());
        component.setDescription(componentAddDTO.getDescription());
        component.setLocation(location);

        if (componentAddDTO.getKeywords() != null) {
            component.setKeywords(componentAddDTO.getKeywords().stream().sorted().toList());
        }

        if (componentAddDTO.getDeprecatedInventoryMarks() != null) {
            component.setDeprecatedInventoryMarks(componentAddDTO.getDeprecatedInventoryMarks());
        }

        if (!component.getZpf().equals(componentAddDTO.getZpf())) {
            if (componentRepo.findByZpf(componentAddDTO.getZpf()).isPresent()) {
                throw new RuntimeException("Component with same code1 exists");
            }
            component.setZpf(componentAddDTO.getZpf());
        }

        if (!component.getFer().equals(componentAddDTO.getFer())) {
            if (componentRepo.findByFer(componentAddDTO.getFer()).isPresent()) {
                throw new RuntimeException("Component with same code1 exists");
            }
            component.setFer(componentAddDTO.getFer());
        }
    }

    @Transactional
    public void deleteById(Long id) {
        Component component = componentRepo.findById(id).orElseThrow(() -> new RuntimeException("Component not found"));

        User user = userServiceJPA.getAuthenticatedUser();

        unlinkExperimentsFromComponent(component, user);

        logServiceJPA.deleteLogs(component.getLogList());

        fileServiceJPA.deleteFiles(component.getFileList());

        logServiceJPA.componentDeletion(component, user);

        componentRepo.deleteById(id);
    }

    public ComponentShowDTO getShowDTO(Component component) {
        if (component == null) {
            return null;
        } else {
            ComponentShowDTO componentShowDTO = new ComponentShowDTO();
            componentShowDTO.setId(component.getId());
            componentShowDTO.setName(component.getName());
            componentShowDTO.setZpf(component.getZpf());
            componentShowDTO.setFer(component.getFer());
            componentShowDTO.setFerStatus(component.getFerStatus());
            componentShowDTO.setDeprecatedInventoryMarks(component.getDeprecatedInventoryMarks());
            componentShowDTO.setDescription(component.getDescription());
            componentShowDTO.setKeywords(component.getKeywords().stream().sorted().toList());
            componentShowDTO.setQuantity(component.getQuantity());

            componentShowDTO.setLocationDTO(locationMapper.mapLocationToDTO(component.getLocation()));
            componentShowDTO.setExperimentDTOList(experimentMapper.mapExperimentsToDTOs(component.getExperimentList()));
            componentShowDTO.setLogShowDTOList(logServiceJPA.mapLogsToDTOs(component.getLogList()));
            componentShowDTO.setFileShowDTOList(fileServiceJPA.mapFilesToDTOs(component.getFileList()));

            return componentShowDTO;
        }
    }

    private void linkExperimentsWithComponent(Component component, List<Experiment> experimentList, User user) {
        if (experimentList != null) {
            for (Experiment experiment : experimentList) {
                experiment.getComponentList().add(component);

                experimentRepo.save(experiment);

                logServiceJPA.linkComponentAndExperiment(component, experiment, user);
            }
        }
    }

    private void unlinkExperimentsFromComponent(Component component, User user) {
        if (component.getExperimentList() != null) {

            List<Experiment> experimentsToUnlink = new ArrayList<>(component.getExperimentList());

            for (Experiment experiment : experimentsToUnlink) {
                experiment.getComponentList().remove(component);
                component.getExperimentList().remove(experiment);

                experimentRepo.save(experiment);
                componentRepo.save(component);

                logServiceJPA.unlinkExperimentFromComponent(experiment, component, user);
            }
        }
    }

    private Component mapDTOtoEntity(ComponentAddDTO componentAddDTO, Location location, List<Experiment> experimentList) {
        if (componentRepo.findByZpf(componentAddDTO.getZpf()).isPresent()) {
            throw new RuntimeException("Component with same ZPF already exists");
        }

        Component component = new Component(
                componentAddDTO.getName(),
                componentAddDTO.getZpf(),
                componentAddDTO.getFer(),
                componentAddDTO.getFerStatus(),
                componentAddDTO.getDeprecatedInventoryMarks(),
                componentAddDTO.getQuantity(),
                componentAddDTO.getDescription(),
                componentAddDTO.getKeywords().stream().sorted().toList(),
                location
        );

        if (experimentList != null && !experimentList.isEmpty()) {
            component.setExperimentList(experimentList);
        }
        return component;
    }

    public List<Component> findAllByIds(List<Long> componentIds) {
        if (componentIds == null) {
            return null;
        } else {
            List<Component> componentList = new ArrayList<>();
            for (Long id : componentIds) {
                componentRepo.findById(id).ifPresent(componentList::add);
            }
            return componentList;
        }
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

    public void quickSave(Component component) {
        componentRepo.save(component);
    }
}
