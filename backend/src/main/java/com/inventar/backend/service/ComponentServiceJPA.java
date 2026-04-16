package com.inventar.backend.service;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.User;
import com.inventar.backend.domain.Location;
import com.inventar.backend.repo.ComponentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ComponentServiceJPA {

    private final ComponentRepo componentRepo;
    private final ExperimentServiceJPA experimentServiceJPA;
    private final UserServiceJPA userServiceJPA;
    private final LocationServiceJPA locationServiceJPA;
    private final LogServiceJPA logServiceJPA;
    private final FileServiceJPA fileServiceJPA;

    @Autowired
    public ComponentServiceJPA(ComponentRepo componentRepo, ExperimentServiceJPA experimentServiceJPA, UserServiceJPA userServiceJPA, LocationServiceJPA locationServiceJPA, LogServiceJPA logServiceJPA, FileServiceJPA fileServiceJPA) {
        this.componentRepo = componentRepo;
        this.experimentServiceJPA = experimentServiceJPA;
        this.userServiceJPA = userServiceJPA;
        this.locationServiceJPA = locationServiceJPA;
        this.logServiceJPA = logServiceJPA;
        this.fileServiceJPA = fileServiceJPA;
    }

    public Component save(ComponentAddDTO componentAddDTO, MultipartFile[] files) {
        User user = userServiceJPA.getAuthenticatedUser();

        Location location = locationServiceJPA.findById(componentAddDTO.getLocationID());

        List<Experiment> experimentList = experimentServiceJPA.findAllbyIds(componentAddDTO.getExperimentIds());

        Component component = mapToEntity(componentAddDTO, location, experimentList);

        componentRepo.save(component);

        logServiceJPA.componentCreation(component, user);

        fileServiceJPA.handleComponentFiles(component, files, user);

        linkExperimentsWithComponent(component, experimentList, user);

        return component;
    }

    private void linkExperimentsWithComponent(Component component, List<Experiment> experimentList, User user) {
        if (experimentList == null) {
            return;
        } else {
            for (Experiment experiment : experimentList) {
                experiment.getComponentList().add(component);

                logServiceJPA.linkComponentAndExperiment(component, experiment, user);

                experimentServiceJPA.quickUpdate(experiment);
            }
        }
    }

    private void unlinkExperimentsFromComponent(Component component, User user) {
        if (component.getExperimentList() == null) {
            return;
        } else {
            for (Experiment experiment : component.getExperimentList()) {
                experiment.getComponentList().remove(component);

                logServiceJPA.unlinkComponentFromExperiment(component, experiment, user);
            }
        }
    }

    private Component mapToEntity(ComponentAddDTO componentAddDTO, Location location, List<Experiment> experimentList) {
        Component component = new Component(
                componentAddDTO.getName(),
                componentAddDTO.getZpf(),
                componentAddDTO.getFer(),
                componentAddDTO.getQuantity(),
                componentAddDTO.getDescription(),
                componentAddDTO.getKeywords(),
                location
        );

        if (!experimentList.isEmpty()) {
            component.setExperimentList(experimentList);
        }
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

            componentShowDTO.setLocationDTO(locationServiceJPA.mapLocationToDTO(component.getLocation()));
            componentShowDTO.setExperimentShowDTOList(experimentServiceJPA.mapExperimentsToDTOs(component.getExperimentList()));
            componentShowDTO.setLogShowDTOList(logServiceJPA.mapLogsToDTOs(component.getLogList()));
            componentShowDTO.setFileShowDTOList(fileServiceJPA.mapFilesToDTOs(component.getFileList()));

            return componentShowDTO;
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
}
