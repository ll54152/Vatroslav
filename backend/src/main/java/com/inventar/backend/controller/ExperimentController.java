package com.inventar.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ExperimentAddDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.service.ExperimentServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/experiment")
public class ExperimentController {

    private final ExperimentServiceJPA experimentServiceJPA;

    @Autowired
    public ExperimentController(ExperimentServiceJPA experimentServiceJPA) {
        this.experimentServiceJPA = experimentServiceJPA;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addExperiment(
            @RequestPart("data") ExperimentAddDTO experimentAddDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        experimentServiceJPA.save(experimentAddDTO, files, profileImage);

        return ResponseEntity.status(HttpStatus.CREATED).body("Eksperiment dodan uspješno");
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ExperimentDTO>> getAllExperiments() {
        List<ExperimentDTO> experimentDTOList = experimentServiceJPA.findAll().stream()
                .map(experiment -> new ExperimentDTO(experiment.getId(), experiment.getName(), experiment.getZpf(), experiment.getDescription(), experiment.getKeywords()))
                .toList();
        return new ResponseEntity<>(experimentDTOList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ExperimentShowDTO> getExperiment(@PathVariable Long id) {
        Experiment experiment = experimentServiceJPA.findById(id);
        if (experiment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(experimentServiceJPA.getShowDTO(experiment), HttpStatus.OK);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteExperiment(@PathVariable Long id) {
        Experiment experiment = experimentServiceJPA.findById(id);
        if (experiment != null) {
            experimentServiceJPA.deleteById(id);
            return new ResponseEntity<>("Eksperiment obrisan uspješno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Eksperiment nije pronađen", HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateExperiment(@PathVariable Long id,
                                                   @RequestPart(value = "name", required = false) String name,
                                                   @RequestPart(value = "zpf", required = false) String zpf,
                                                   @RequestPart(value = "field", required = false) String field,
                                                   @RequestPart(value = "subject", required = false) String subject,
                                                   @RequestPart(value = "description", required = false) String description,
                                                   @RequestPart(value = "keywords", required = false) String keywords,
                                                   @RequestPart(value = "materials", required = false) String materials,
                                                   @RequestPart(value = "logovi", required = false) String logs,
                                                   @RequestPart(value = "komponente", required = false) String componentJSON,
                                                   @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                   @RequestPart(value = "deletedFileIds", required = false) String deletedFileIdsJSON) {

        Experiment experiment = experimentServiceJPA.findById(id);
        if (experiment == null) {
            return new ResponseEntity<>("Eksperiment nije pronađen", HttpStatus.NOT_FOUND);
        }

        ExperimentAddDTO experimentAddDTO = new ExperimentAddDTO();
        experimentAddDTO.setName(name);
        experimentAddDTO.setZpf(zpf);
        experimentAddDTO.setField(field);
        experimentAddDTO.setSubject(subject);
        experimentAddDTO.setDescription(description);
        experimentAddDTO.setKeywords(Collections.singletonList(keywords));
        experimentAddDTO.setMaterials(materials);

        List<String> componentList = new ArrayList<>();
        if (componentJSON != null && !componentJSON.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                componentList = Arrays.asList(objectMapper.readValue(componentJSON, String[].class));
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }

        List<String> logList = new ArrayList<>();
        if (logs != null && !logs.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                logList = Arrays.asList(objectMapper.readValue(logs, String[].class));
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }

        List<FileDTO> fileDTOList = new ArrayList<>();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                FileDTO fileDTO = new FileDTO();
                fileDTO.setName(file.getOriginalFilename());
                fileDTO.setEntityType("eksperiment");
                fileDTO.setData(file);
                fileDTO.setFileCategory("general");
                fileDTOList.add(fileDTO);
            }
            experimentAddDTO.setFileDTOList(fileDTOList);
        }

        List<Long> deletedFilesList = new ArrayList<>();
        if (deletedFileIdsJSON != null && !deletedFileIdsJSON.isEmpty()) {

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                deletedFilesList = Arrays.asList(objectMapper.readValue(deletedFileIdsJSON, Long[].class));
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }


        return new ResponseEntity<>(experimentServiceJPA.update(id, experimentAddDTO, componentList, logList, deletedFilesList, fileDTOList), HttpStatus.OK);
    }
}
