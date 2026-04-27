package com.inventar.backend.service;

import com.inventar.backend.DTO.ExperimentAddDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.DTO.ExperimentEditDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.User;
import com.inventar.backend.mapper.ComponentMapper;
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
    private final ComponentMapper componentMapper;

    private final UserServiceJPA userServiceJPA;

    private final LogServiceJPA logServiceJPA;
    private final FileServiceJPA fileServiceJPA;


    @Autowired
    public ExperimentServiceJPA(UserServiceJPA userServiceJPA, LogServiceJPA logServiceJPA, FileServiceJPA fileServiceJPA, ComponentMapper componentMapper, ComponentRepo componentRepo, ExperimentRepo experimentRepo) {
        this.userServiceJPA = userServiceJPA;
        this.logServiceJPA = logServiceJPA;
        this.fileServiceJPA = fileServiceJPA;
        this.componentMapper = componentMapper;
        this.componentRepo = componentRepo;
        this.experimentRepo = experimentRepo;
    }

    @Transactional
    public Long save(ExperimentAddDTO experimentAddDTO, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages) {
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
        User user = userServiceJPA.getAuthenticatedUser();

        Experiment experiment = experimentRepo.findById(id).orElseThrow(() -> new RuntimeException("Experiment not found"));

        List<Component> newComponents = componentRepo.findAllById(experimentEditDTO.getComponentIds());

        editBasicFields(experiment, experimentEditDTO);

        syncComponentsWithExperiment(experiment, newComponents, user);

        fileServiceJPA.syncExperimentFiles(experiment, experimentEditDTO.getExistingFileIds(), files, profileImage, otherImages, user);

        logServiceJPA.experimentUpdated(experiment, user);

        experimentRepo.save(experiment);
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

        if (experiment.getZpf() == null || !experiment.getZpf().equals(experimentEditDTO.getZpf())) {
            if (componentRepo.findByZpf(experimentEditDTO.getZpf()).isPresent()) {
                throw new RuntimeException("Experiment with same ZPF exists");
            }
            experiment.setZpf(experimentEditDTO.getZpf());
        }
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
            experimentShowDTO.setKeywords(experiment.getKeywords().stream().sorted().toList());
            experimentShowDTO.setMaterials(experiment.getMaterials());

            experimentShowDTO.setComponentDTOList(componentMapper.mapComponentsToDTOs(experiment.getComponentList()));
            experimentShowDTO.setLogShowDTOList(logServiceJPA.mapLogsToDTOs(experiment.getLogList()));
            experimentShowDTO.setFileShowDTOList(fileServiceJPA.mapFilesToDTOs(experiment.getFileList()));

            return experimentShowDTO;
        }
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
                experimentAddDTO.getKeywords().stream().sorted().toList(),
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
}
