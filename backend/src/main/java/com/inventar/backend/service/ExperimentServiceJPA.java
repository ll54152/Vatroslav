package com.inventar.backend.service;

import com.inventar.backend.DTO.ExperimentAddDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentEditDTO;
import com.inventar.backend.DTO.ExperimentPublicShowDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.User;
import com.inventar.backend.exception.ResourceNotFoundException;
import com.inventar.backend.mapper.ExperimentMapper;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExperimentServiceJPA {

    private final ExperimentRepo experimentRepo;

    private final ComponentRepo componentRepo;

    private final UserServiceJPA userServiceJPA;

    private final LogServiceJPA logServiceJPA;

    private final FileServiceJPA fileServiceJPA;
    private final ExperimentMapper experimentMapper;

    @Autowired
    public ExperimentServiceJPA(ExperimentRepo experimentRepo, ComponentRepo componentRepo, UserServiceJPA userServiceJPA, LogServiceJPA logServiceJPA, FileServiceJPA fileServiceJPA, ExperimentMapper experimentMapper) {
        this.experimentRepo = experimentRepo;
        this.componentRepo = componentRepo;
        this.userServiceJPA = userServiceJPA;
        this.logServiceJPA = logServiceJPA;
        this.fileServiceJPA = fileServiceJPA;
        this.experimentMapper = experimentMapper;
    }

    @Transactional
    public Long save(ExperimentAddDTO experimentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        if (experimentAddDTO == null) {
            throw new IllegalArgumentException("Podaci eksperimenta ne smiju biti prazni");
        }

        if (experimentAddDTO.getName() == null || experimentAddDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv eksperimenta je obavezan");
        }

        User user = userServiceJPA.getAuthenticatedUser();

        List<Component> componentList = componentRepo.findAllById(experimentAddDTO.getComponentIds());

        Experiment experiment = mapDTOtoEntity(experimentAddDTO, componentList);

        experimentRepo.save(experiment);

        logServiceJPA.experimentCreation(experiment, user);

        fileServiceJPA.handleExperimentFiles(experiment, files, profileImage, otherImages, user);

        linkComponentsWithExperiment(experiment, componentList, user);

        return experiment.getId();
    }

    @Transactional
    public void edit(Long id, ExperimentEditDTO experimentEditDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Nevažeći ID eksperimenta");
        }

        if (experimentEditDTO == null) {
            throw new IllegalArgumentException("Podaci eksperimenta ne smiju biti prazni");
        }

        if (experimentEditDTO.getName() == null || experimentEditDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv eksperimenta je obavezan");
        }

        User user = userServiceJPA.getAuthenticatedUser();

        Experiment experiment = experimentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Experiment", "id", id));

        List<Component> newComponents = componentRepo.findAllById(experimentEditDTO.getComponentIds());

        editBasicFields(experiment, experimentEditDTO);

        syncComponentsWithExperiment(experiment, newComponents, user);

        fileServiceJPA.syncExperimentFiles(experiment, experimentEditDTO.getExistingFileIds(), files, profileImage, otherImages, user);

        logServiceJPA.experimentUpdated(experiment, user);

        experimentRepo.save(experiment);
    }

    public ExperimentShowDTO getShowDTO(Experiment experiment) {
        return experimentMapper.getShowDTO(experiment);
    }

    private void syncComponentsWithExperiment(Experiment experiment, List<Component> newComponents, User user) {
        List<Component> currentComponents = new ArrayList<>(experiment.getComponentList() != null
                ? experiment.getComponentList()
                : new ArrayList<>());

        for (Component oldComponent : new ArrayList<>(currentComponents)) {
            if (!newComponents.contains(oldComponent)) {
                oldComponent.getExperimentList().remove(experiment);
                componentRepo.save(oldComponent);

                logServiceJPA.unlinkExperimentFromComponent(experiment, oldComponent, user);
            }
        }

        for (Component newComponent : newComponents) {
            if (!currentComponents.contains(newComponent)) {
                newComponent.getExperimentList().add(experiment);
                componentRepo.save(newComponent);

                logServiceJPA.linkComponentAndExperiment(newComponent, experiment, user);
            }
        }

        experiment.setComponentList(new ArrayList<>(newComponents));
    }

    private void editBasicFields(Experiment experiment, ExperimentEditDTO experimentEditDTO) {

        experiment.setName(experimentEditDTO.getName());
        experiment.setZpf(experimentEditDTO.getZpf());
        experiment.setField(experimentEditDTO.getField());
        experiment.setSubject(experimentEditDTO.getSubject());
        experiment.setDescription(experimentEditDTO.getDescription());
        experiment.setKeywords(experimentEditDTO.getKeywords().stream().sorted().toList());
        experiment.setItPublic(experimentEditDTO.isItPublic());

        if (experimentEditDTO.getZpf() == null) {
            experiment.setZpf(null);
        } else if (experimentEditDTO.getZpf().isEmpty()) {
            experiment.setZpf(null);
        } else {
            if (experiment.getZpf() == null || !experiment.getZpf().equals(experimentEditDTO.getZpf())) {
                if (componentRepo.findByZpf(experimentEditDTO.getZpf()).isPresent()) {
                    throw new IllegalArgumentException("Experiment with same ZPF already exists");
                }
                experiment.setZpf(experimentEditDTO.getZpf());
            }
        }
    }

    @Transactional
    public void deleteById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Nevažeći ID eksperimenta");
        }

        Experiment experiment = experimentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Experiment", "id", id));

        User user = userServiceJPA.getAuthenticatedUser();

        unlinkComponentsFromExperiment(experiment, user);

        logServiceJPA.deleteLogs(experiment.getLogList());

        fileServiceJPA.deleteFiles(experiment.getFileList());

        logServiceJPA.experimentDeletion(experiment, user);

        experimentRepo.deleteById(id);
    }


    public ExperimentPublicShowDTO getPublicShowDTO(Experiment experiment) {
        return experimentMapper.mapExperimentToPublicShowDTO(experiment);
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
            throw new IllegalArgumentException("Experiment with same ZPF already exists");
        }

        Experiment experiment = new Experiment(
                experimentAddDTO.getName(),
                experimentAddDTO.getZpf(),
                experimentAddDTO.getField(),
                experimentAddDTO.getSubject(),
                experimentAddDTO.getDescription(),
                experimentAddDTO.getKeywords().stream().sorted().toList(),
                experimentAddDTO.getMaterials(),
                experimentAddDTO.isItPublic()
        );

        if (componentList != null && !componentList.isEmpty()) {
            experiment.setComponentList(componentList);
        }

        return experiment;
    }

    public List<ExperimentDTO> findAll() {
        return experimentRepo.findAll().stream().map(experimentMapper::mapExperimentToDTO).toList();
    }

    public Experiment findById(Long id) {
        return experimentRepo.findById(id).orElse(null);
    }

    public List<ExperimentDTO> findAllPublic() {
        return experimentRepo.findAll().stream().filter(Experiment::isItPublic).map(experimentMapper::mapExperimentToDTO).toList();
    }
}
