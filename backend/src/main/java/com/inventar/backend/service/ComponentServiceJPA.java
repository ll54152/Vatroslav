package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ComponentEditDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.Location;
import com.inventar.backend.domain.User;
import com.inventar.backend.exception.ResourceNotFoundException;
import com.inventar.backend.mapper.ComponentMapper;
import com.inventar.backend.mapper.ExperimentMapper;
import com.inventar.backend.mapper.FileMapper;
import com.inventar.backend.mapper.LogMapper;
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
    private final ComponentMapper componentMapper;

    private final ExperimentRepo experimentRepo;
    private final ExperimentMapper experimentMapper;

    private final UserServiceJPA userServiceJPA;

    private final LocationRepo locationRepo;
    private final LocationMapper locationMapper;

    private final LogServiceJPA logServiceJPA;
    private final LogMapper logMapper;

    private final FileServiceJPA fileServiceJPA;
    private final FileMapper fileMapper;

    @Autowired
    public ComponentServiceJPA(ComponentRepo componentRepo, ComponentMapper componentMapper, ExperimentRepo experimentRepo, ExperimentMapper experimentMapper, UserServiceJPA userServiceJPA, LocationRepo locationRepo, LocationMapper locationMapper, LogServiceJPA logServiceJPA, LogMapper logMapper, FileServiceJPA fileServiceJPA, FileMapper fileMapper) {
        this.componentRepo = componentRepo;
        this.componentMapper = componentMapper;
        this.experimentRepo = experimentRepo;
        this.experimentMapper = experimentMapper;
        this.userServiceJPA = userServiceJPA;
        this.locationRepo = locationRepo;
        this.locationMapper = locationMapper;
        this.logServiceJPA = logServiceJPA;
        this.logMapper = logMapper;
        this.fileServiceJPA = fileServiceJPA;
        this.fileMapper = fileMapper;
    }

    @Transactional
    public Long save(ComponentAddDTO componentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        validateBasicComponentAddDTOFields(componentAddDTO);

        User user = userServiceJPA.getAuthenticatedUser();

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElseThrow(() -> new ResourceNotFoundException("Location", "id", componentAddDTO.getLocationID()));

        List<Experiment> experimentList = experimentRepo.findAllById(componentAddDTO.getExperimentIds());

        Component component = mapDTOtoEntity(componentAddDTO, location, experimentList);

        componentRepo.save(component);

        logServiceJPA.componentCreation(component, user);

        fileServiceJPA.handleComponentFiles(component, files, profileImage, otherImages, user);

        linkExperimentsWithComponent(component, experimentList, user);

        return component.getId();
    }

    private static void validateBasicComponentAddDTOFields(ComponentAddDTO componentAddDTO) {
        if (componentAddDTO == null) {
            throw new IllegalArgumentException("Podaci komponente ne smiju biti prazni");
        }

        if (componentAddDTO.getName() == null || componentAddDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv komponente je obavezan");
        }

        if (componentAddDTO.getLocationID() == null) {
            throw new IllegalArgumentException("Lokacija je obavezna");
        }

        if (componentAddDTO.getFerStatus() == null || componentAddDTO.getFer().trim().isEmpty()) {
            throw new IllegalArgumentException("Fer status je obavezan");
        }

        if (componentAddDTO.getQuantity() == null) {
            throw new IllegalArgumentException("Količina je obavezna");
        }

        if (componentAddDTO.getZpf() == null || componentAddDTO.getZpf().trim().isEmpty()) {
            throw new IllegalArgumentException("ZPF inventarna oznaka je obavezan");
        }
    }

    @Transactional
    public void edit(Long id, ComponentEditDTO componentEditDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        validateBasicComponentEditDTOFields(id, componentEditDTO);

        User user = userServiceJPA.getAuthenticatedUser();

        Component component = componentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Component", "id", id));

        Location location = locationRepo.findById(componentEditDTO.getLocationID()).orElseThrow(() -> new ResourceNotFoundException("Location", "id", componentEditDTO.getLocationID()));

        List<Experiment> newExperiments = experimentRepo.findAllById(componentEditDTO.getExperimentIds());

        editBasicFields(component, componentEditDTO, location);

        syncExperimentsWithComponent(component, newExperiments, user);

        fileServiceJPA.syncComponentFiles(component, componentEditDTO.getExistingFileIds(), files, profileImage, otherImages, user);

        logServiceJPA.componentUpdated(component, user);

        componentRepo.save(component);
    }

    private static void validateBasicComponentEditDTOFields(Long id, ComponentEditDTO componentEditDTO) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Nevažeći ID komponente");
        }

        if (componentEditDTO == null) {
            throw new IllegalArgumentException("Podaci komponente ne smiju biti prazni");
        }

        if (componentEditDTO.getLocationID() == null) {
            throw new IllegalArgumentException("Lokacija je obavezna");
        }

        if (componentEditDTO.getName() == null || componentEditDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv komponente je obavezan");
        }

        if (componentEditDTO.getFerStatus() == null) {
            throw new IllegalArgumentException("Fer status je obavezan");
        }

        if (componentEditDTO.getQuantity() == null) {
            throw new IllegalArgumentException("Količina je obavezna");
        }

        if (componentEditDTO.getZpf() == null || componentEditDTO.getZpf().trim().isEmpty()) {
            throw new IllegalArgumentException("ZPF inventarna oznaka je obavezna");
        }
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
            componentShowDTO.setLogShowDTOList(logMapper.mapLogsToShowDTOs(component.getLogList()));
            componentShowDTO.setFileShowDTOList(fileMapper.mapFilesToDTOs(component.getFileList()));

            return componentShowDTO;
        }
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
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Nevažeći ID lokacije");
        }

        Location location = locationRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Location", "id", id));

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

        if (componentEditDTO.getZpf() == null) {
            component.setZpf(null);
        } else if (componentEditDTO.getZpf().isEmpty()) {
            component.setZpf(null);
        } else {
            if (component.getZpf() == null || !component.getZpf().equals(componentEditDTO.getZpf())) {
                if (componentRepo.findByZpf(componentEditDTO.getZpf()).isPresent()) {
                    throw new IllegalArgumentException("Component with same ZPF already exists");
                }
                component.setZpf(componentEditDTO.getZpf());
            }
        }

        if (componentEditDTO.getFer() == null) {
            component.setFer(null);
        } else if (componentEditDTO.getFer().isEmpty()) {
            component.setFer(null);
        } else {
            if (component.getFer() == null || !component.getFer().equals(componentEditDTO.getFer())) {
                if (componentRepo.findByFer(componentEditDTO.getFer()).isPresent()) {
                    throw new IllegalArgumentException("Component with same FER already exists");
                }
                component.setFer(componentEditDTO.getFer());
            }
        }
    }

    @Transactional
    public void deleteById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Nevažeći ID komponente");
        }

        Component component = componentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Component", "id", id));

        User user = userServiceJPA.getAuthenticatedUser();

        unlinkExperimentsFromComponent(component, user);

        logServiceJPA.deleteLogs(component.getLogList());

        fileServiceJPA.deleteFiles(component.getFileList());

        logServiceJPA.componentDeletion(component, user);

        componentRepo.deleteById(id);
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
            throw new IllegalArgumentException("Component with same ZPF already exists");
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

    public List<ComponentDTO> findAll() {
        return componentRepo.findAll().stream().map(componentMapper::mapComponentToDTO).toList();
    }

    public void quickSave(Component component) {
        componentRepo.save(component);
    }
}
