package com.inventar.backend.mapper;

import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentPublicShowDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.domain.Experiment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExperimentMapper {

    private final ComponentMapper componentMapper;
    private final LogMapper logMapper;
    private final FileMapper fileMapper;

    @Autowired
    public ExperimentMapper(ComponentMapper componentMapper, LogMapper logMapper, FileMapper fileMapper) {
        this.componentMapper = componentMapper;
        this.logMapper = logMapper;
        this.fileMapper = fileMapper;
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
            experimentShowDTO.setItPublic(experiment.isItPublic());

            experimentShowDTO.setComponentDTOList(componentMapper.mapComponentsToDTOs(experiment.getComponentList()));
            experimentShowDTO.setLogShowDTOList(logMapper.mapLogsToShowDTOs(experiment.getLogList()));
            experimentShowDTO.setFileShowDTOList(fileMapper.mapFilesToDTOs(experiment.getFileList()));

            return experimentShowDTO;
        }
    }

    public ExperimentDTO mapExperimentToDTO(Experiment experiment) {
        if (experiment == null) {
            return null;
        } else {
            ExperimentDTO experimentDTO = new ExperimentDTO();
            experimentDTO.setId(experiment.getId());
            experimentDTO.setName(experiment.getName());
            experimentDTO.setZpf(experiment.getZpf());
            experimentDTO.setDescription(experiment.getDescription());
            experimentDTO.setKeywords(experiment.getKeywords().stream().sorted().toList());
            experimentDTO.setItPublic(experiment.isItPublic());

            return experimentDTO;
        }
    }

    public List<ExperimentDTO> mapExperimentsToDTOs(List<Experiment> experimentList) {
        if (experimentList == null) {
            return List.of();
        } else {
            List<ExperimentDTO> experimentDTOList = new ArrayList<>();

            for (Experiment experiment : experimentList) {
                ExperimentDTO experimentDTO = new ExperimentDTO();
                experimentDTO.setId(experiment.getId());
                experimentDTO.setName(experiment.getName());
                experimentDTO.setZpf(experiment.getZpf());
                experimentDTO.setDescription(experiment.getDescription());
                experimentDTO.setKeywords(experiment.getKeywords().stream().sorted().toList());
                experimentDTO.setItPublic(experiment.isItPublic());

                experimentDTOList.add(experimentDTO);
            }

            return experimentDTOList;
        }
    }

    public List<ExperimentShowDTO> mapExperimentsToShowDTOs(List<Experiment> experimentList) {
        if (experimentList == null) {
            return List.of();
        } else {
            List<ExperimentShowDTO> experimentShowDTOList = new ArrayList<>();

            for (Experiment experiment : experimentList) {
                ExperimentShowDTO experimentShowDTO = new ExperimentShowDTO();
                experimentShowDTO.setId(experiment.getId());
                experimentShowDTO.setName(experiment.getName());
                experimentShowDTO.setZpf(experiment.getZpf());
                experimentShowDTO.setSubject(experiment.getSubject());
                experimentShowDTO.setField(experiment.getField());
                experimentShowDTO.setDescription(experiment.getDescription());
                experimentShowDTO.setKeywords(experiment.getKeywords().stream().sorted().toList());
                experimentShowDTO.setMaterials(experiment.getMaterials());
                experimentShowDTO.setItPublic(experiment.isItPublic());

                experimentShowDTOList.add(experimentShowDTO);
            }

            return experimentShowDTOList;
        }
    }

    public ExperimentPublicShowDTO mapExperimentToPublicShowDTO(Experiment experiment) {
        if (experiment == null || !experiment.isItPublic()) {
            return null;
        } else {
            ExperimentPublicShowDTO experimentPublicShowDTO = new ExperimentPublicShowDTO();
            experimentPublicShowDTO.setId(experiment.getId());
            experimentPublicShowDTO.setName(experiment.getName());
            experimentPublicShowDTO.setZpf(experiment.getZpf());
            experimentPublicShowDTO.setField(experiment.getField());
            experimentPublicShowDTO.setSubject(experiment.getSubject());
            experimentPublicShowDTO.setDescription(experiment.getDescription());
            experimentPublicShowDTO.setKeywords(experiment.getKeywords().stream().sorted().toList());
            experimentPublicShowDTO.setMaterials(experiment.getMaterials());

            experimentPublicShowDTO.setFileShowDTOList(fileMapper.mapFilesToDTOs(experiment.getFileList().stream().filter(file -> file.getFileCategory().equals("profileImage") || file.getFileCategory().equals("otherImage")).toList()));

            experimentPublicShowDTO.setComponentDTOList(componentMapper.mapComponentsToDTOs(experiment.getComponentList()));

            return experimentPublicShowDTO;
        }
    }
}
