package com.inventar.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ComponentShowDTO;
import com.inventar.backend.DTO.ExperimentDTO;
import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.service.ComponentServiceJPA;
import com.inventar.backend.service.ExperimentServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/component")
public class ComponentController {

    private ComponentServiceJPA componentServiceJPA;
    private ExperimentServiceJPA experimentServiceJPA;

    @Autowired
    public ComponentController(ComponentServiceJPA componentServiceJPA, ExperimentServiceJPA experimentServiceJPA) {
        this.componentServiceJPA = componentServiceJPA;
        this.experimentServiceJPA = experimentServiceJPA;
    }

    @PostMapping(value = "/add")
    public ResponseEntity<String> addComponent(
            @RequestPart("name") String name,
            @RequestPart("zpf") String zpf,
            @RequestPart("fer") String fer,
            @RequestPart("quantity") String quantityString,
            @RequestPart("locationID") String locationIDString,
            @RequestPart("description") String description,
            @RequestPart("keywords") String keywords,
            @RequestPart("eksperimentIDs") String experimentIDsJSON,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        ComponentAddDTO componentAddDTO = new ComponentAddDTO();
        componentAddDTO.setName(name);
        componentAddDTO.setZpf(zpf);
        componentAddDTO.setFer(fer);
        componentAddDTO.setKeywords(keywords);
        componentAddDTO.setQuantity(Integer.parseInt(quantityString));
        componentAddDTO.setLocationID(Long.parseLong(locationIDString));
        componentAddDTO.setDescription(description);


        if (experimentIDsJSON != null && !experimentIDsJSON.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                List<Integer> experimentIdList = objectMapper.readValue(experimentIDsJSON, new TypeReference<>() {
                });
                List<ExperimentDTO> experimentDTOList = new ArrayList<>();
                for (Integer experimentId : experimentIdList) {
                    Experiment experiment = experimentServiceJPA.findById(Long.valueOf(experimentId));
                    if (experiment != null) {
                        experimentDTOList.add(new ExperimentDTO(experiment.getId(), experiment.getName(), experiment.getZpf(), experiment.getDescription(), experiment.getKeywords()));
                    }
                }
                componentAddDTO.setExperimentDTOList(experimentDTOList);
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }

        if (files != null && files.length > 0) {
            List<FileDTO> fileDTOList = new ArrayList<>();
            for (MultipartFile file : files) {
                FileDTO fileDTO = new FileDTO();
                fileDTO.setName(file.getOriginalFilename());
                fileDTO.setEntityType("eksperiment");
                fileDTO.setData(file);
                fileDTO.setFileCategory("general");
                fileDTOList.add(fileDTO);
            }
            componentAddDTO.setFileDTOList(fileDTOList);
        }
        componentServiceJPA.save(componentAddDTO);
        return new ResponseEntity<>("Komponenta dodata uspešno", HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ComponentDTO>> getAllComponents() {
        List<ComponentDTO> componentDTOList = componentServiceJPA.findAll().stream()
                .map(component -> new ComponentDTO(component.getId(), component.getName(), component.getZpf(), component.getDescription(), component.getKeywords()))
                .toList();
        return new ResponseEntity<>(componentDTOList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ComponentShowDTO> getComponent(@PathVariable Long id) {
        Component component = componentServiceJPA.findById(id);
        if (component == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(componentServiceJPA.getShowDTO(component), HttpStatus.OK);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComponent(@PathVariable Long id) {
        Component component = componentServiceJPA.findById(id);
        if (component != null) {
            componentServiceJPA.deleteById(id);
            return new ResponseEntity<>("Komponenta obrisana uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Komponenta nije pronađena", HttpStatus.NOT_FOUND);
        }
    }
}
