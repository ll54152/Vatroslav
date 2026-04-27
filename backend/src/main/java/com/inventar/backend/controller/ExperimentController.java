package com.inventar.backend.controller;

import com.inventar.backend.DTO.ExperimentAddDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.ExperimentEditDTO;
import com.inventar.backend.DTO.ExperimentShowDTO;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.service.ExperimentServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/experiment")
public class ExperimentController {

    private final ExperimentServiceJPA experimentServiceJPA;

    @Autowired
    public ExperimentController(ExperimentServiceJPA experimentServiceJPA) {
        this.experimentServiceJPA = experimentServiceJPA;
    }

    @PostMapping("/add")
    public ResponseEntity<Long> addExperiment(
            @RequestPart("data") ExperimentAddDTO experimentAddDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "otherImages", required = false) MultipartFile[] otherImages) {

        Long experimentId = experimentServiceJPA.save(experimentAddDTO, files, profileImage, otherImages);

        return ResponseEntity.status(HttpStatus.CREATED).body(experimentId);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<String> editComponent(
            @PathVariable Long id,
            @RequestPart("data") ExperimentEditDTO experimentEditDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "otherImages", required = false) MultipartFile[] otherImages
    ) {
        experimentServiceJPA.edit(id, experimentEditDTO, files, profileImage, otherImages);
        return ResponseEntity.ok("Eksperiment ažurirana");
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
}
