package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ComponentEditDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
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
    public Long save(ComponentAddDTO componentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        User user = userServiceJPA.getAuthenticatedUser();

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElseThrow(() -> new RuntimeException("Location not found"));

        List<Experiment> experimentList = experimentRepo.findAllById(componentAddDTO.getExperimentIds());

        Component component = mapDTOtoEntity(componentAddDTO, location, experimentList);

        componentRepo.save(component);

        logServiceJPA.componentCreation(component, user);

        fileServiceJPA.handleComponentFiles(component, files, profileImage, otherImages, user);

        linkExperimentsWithComponent(component, experimentList, user);

        return component.getId();
    }

    @Transactional
    public void edit(Long id, ComponentEditDTO componentEditDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        User user = userServiceJPA.getAuthenticatedUser();

        Component component = componentRepo.findById(id).orElseThrow(() -> new RuntimeException("Component not found"));

        Location location = locationRepo.findById(componentEditDTO.getLocationID()).orElseThrow(() -> new RuntimeException("Location not found"));

        List<Experiment> newExperiments = experimentRepo.findAllById(componentEditDTO.getExperimentIds());

        editBasicFields(component, componentEditDTO, location);

        syncExperimentsWithComponent(component, newExperiments, user);

        fileServiceJPA.syncComponentFiles(component, componentEditDTO.getExistingFileIds(), files, profileImage, otherImages, user);

        logServiceJPA.componentUpdated(component, user);

        componentRepo.save(component);
    }

    private void syncExperimentsWithComponent(Component component, List<Experiment> newExperiments, User user) {
        List<Experiment> currentExperiments = new ArrayList<>(component.getExperimentList() != null
                ? component.getExperimentList()
                : new ArrayList<>());

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

        component.setExperimentList(new ArrayList<>(newExperiments));
    }

    public List<ComponentDTO> getComponentByLocationID(Long id) {
        Location location = locationRepo.findById(id).orElseThrow(() -> new RuntimeException("Location not found"));

        if (location.getComponentList() == null) {
            return new ArrayList<>();
        } else {
            return location.getComponentList().stream()
                    .map(component -> new ComponentDTO(component.getId(), component.getName(), component.getZpf(), component.getDescription(), component.getKeywords()))
                    .toList();
        }
    }

    private void editBasicFields(Component component, ComponentEditDTO componentEditDTO, Location location) {

        component.setName(componentEditDTO.getName());
        component.setQuantity(componentEditDTO.getQuantity());
        component.setDescription(componentEditDTO.getDescription());
        component.setLocation(location);
        component.setFerStatus(componentEditDTO.getFerStatus());

        if (componentEditDTO.getKeywords() != null) {
            component.setKeywords(componentEditDTO.getKeywords());
        }

        if (componentEditDTO.getDeprecatedInventoryMarks() != null) {
            component.setDeprecatedInventoryMarks(componentEditDTO.getDeprecatedInventoryMarks());
        }

        if (component.getZpf() == null || !component.getZpf().equals(componentEditDTO.getZpf())) {
            if (componentRepo.findByZpf(componentEditDTO.getZpf()).isPresent()) {
                throw new RuntimeException("Component with same ZPF exists");
            }
            component.setZpf(componentEditDTO.getZpf());
        }

        if (component.getFer() == null || !component.getFer().equals(componentEditDTO.getFer())) {
            if (componentRepo.findByFer(componentEditDTO.getFer()).isPresent()) {
                throw new RuntimeException("Component with same FER exists");
            }
            component.setFer(componentEditDTO.getFer());
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
                componentAddDTO.getKeywords(),
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
