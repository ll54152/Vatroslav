package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.User;
import com.inventar.backend.domain.Location;
import com.inventar.backend.mapper.ExperimentMapper;
import com.inventar.backend.mapper.LocationMapper;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.LocationRepo;
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

    public Component save(ComponentAddDTO componentAddDTO, MultipartFile[] files) {
        User user = userServiceJPA.getAuthenticatedUser();

        Location location = locationRepo.findById(componentAddDTO.getLocationID()).orElseThrow(() -> new RuntimeException("Location not found"));

        List<Experiment> experimentList = experimentRepo.findAllById(componentAddDTO.getExperimentIds());

        Component component = mapDTOtoEntity(componentAddDTO, location, experimentList);

        componentRepo.save(component);

        logServiceJPA.componentCreation(component, user);

        fileServiceJPA.handleComponentFiles(component, files, user);

        linkExperimentsWithComponent(component, experimentList, user);

        return component;
    }

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
            componentShowDTO.setDescription(component.getDescription());
            componentShowDTO.setKeywords(component.getKeywords());
            componentShowDTO.setQuantity(component.getQuantity());

            componentShowDTO.setLocationDTO(locationMapper.mapLocationToDTO(component.getLocation()));
            componentShowDTO.setExperimentShowDTOList(experimentMapper.mapExperimentsToDTOs(component.getExperimentList()));
            componentShowDTO.setLogShowDTOList(logServiceJPA.mapLogsToDTOs(component.getLogList()));
            componentShowDTO.setFileShowDTOList(fileServiceJPA.mapFilesToDTOs(component.getFileList()));

            return componentShowDTO;
        }
    }

    public List<ComponentShowDTO> mapComponentsToDTOs(List<Component> componentList) {
        if (componentList == null) {
            return List.of();
        } else {
            List<ComponentShowDTO> componentShowDTOList = new ArrayList<>();

            for (Component component : componentList) {
                ComponentShowDTO componentShowDTO = new ComponentShowDTO();
                componentShowDTO.setId(component.getId());
                componentShowDTO.setName(component.getName());
                componentShowDTO.setZpf(component.getZpf());
                componentShowDTO.setFer(component.getFer());
                componentShowDTO.setDescription(component.getDescription());
                componentShowDTO.setKeywords(component.getKeywords());
                componentShowDTO.setQuantity(component.getQuantity());

                componentShowDTOList.add(componentShowDTO);
            }

            return componentShowDTOList;
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
            for (Experiment experiment : component.getExperimentList()) {
                experiment.getComponentList().remove(component);

                experimentRepo.save(experiment);

                logServiceJPA.unlinkComponentFromExperiment(component, experiment, user);
            }
        }
    }

    private Component mapDTOtoEntity(ComponentAddDTO componentAddDTO, Location location, List<Experiment> experimentList) {
        Component component = new Component(
                componentAddDTO.getName(),
                componentAddDTO.getZpf(),
                componentAddDTO.getFer(),
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
