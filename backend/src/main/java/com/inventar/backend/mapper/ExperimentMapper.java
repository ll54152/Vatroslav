package com.inventar.backend.mapper;

import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.domain.Experiment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExperimentMapper {

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
                experimentDTO.setKeywords(experiment.getKeywords());

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
                experimentShowDTO.setKeywords(experiment.getKeywords());
                experimentShowDTO.setMaterials(experiment.getMaterials());

                experimentShowDTOList.add(experimentShowDTO);
            }

            return experimentShowDTOList;
        }
    }
}
