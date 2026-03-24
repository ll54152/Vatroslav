package com.inventar.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventar.backend.DTO.*;
import com.inventar.backend.domain.*;
import com.inventar.backend.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;


@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/experiment")
public class EksperimentController {

    @Autowired
    private EksperimentServiceJPA eksperimentServiceJPA;

    @PostMapping("/add")
    public ResponseEntity<String> addExperiment(@RequestPart("name") String name,
                                                @RequestPart("field") String field,
                                                @RequestPart("subject") String subject,
                                                @RequestPart("description") String description,
                                                @RequestPart("materials") String materials,
                                                @RequestPart("komponente") String komponenteJson,
                                                @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                @RequestPart(value = "profileImage", required = false) MultipartFile[] profileImage) {

        EksperimentAddDTO eksperimentAddDTO = new EksperimentAddDTO();
        eksperimentAddDTO.setName(name);
        eksperimentAddDTO.setField(field);
        eksperimentAddDTO.setSubject(subject);
        eksperimentAddDTO.setDescription(description);
        eksperimentAddDTO.setMaterials(materials);


        if (komponenteJson != null && !komponenteJson.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                eksperimentAddDTO.setKomponente(Arrays.asList(objectMapper.readValue(komponenteJson, KomponentaDTO[].class)));
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }

        List<FilesDTO> filesDTOList = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                FilesDTO filesDTO = new FilesDTO();
                filesDTO.setName(file.getOriginalFilename());
                filesDTO.setEntityType("eksperiment");
                filesDTO.setData(file);
                filesDTO.setFileCategory("general");
                filesDTOList.add(filesDTO);
            }
        }

        if (profileImage != null) {
            for (MultipartFile file : profileImage) {
                FilesDTO filesDTO = new FilesDTO();
                filesDTO.setName(file.getOriginalFilename());
                filesDTO.setEntityType("eksperiment");
                filesDTO.setData(file);
                filesDTO.setFileCategory("profileImage");
                filesDTOList.add(filesDTO);
            }
        }

        if (!filesDTOList.isEmpty()) {
            eksperimentAddDTO.setFiles(filesDTOList);
        }


        eksperimentServiceJPA.save(eksperimentAddDTO);
        return new ResponseEntity<>("Eksperiment dodan uspješno", HttpStatus.CREATED);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<EksperimentDTO>> getAllExperiments() {
        List<EksperimentDTO> eksperimentDTOs = eksperimentServiceJPA.findAll().stream()
                .map(eksperiment -> new EksperimentDTO(eksperiment.getId(), eksperiment.getName()))
                .toList();
        return new ResponseEntity<>(eksperimentDTOs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<EksperimentShowDTO> getExperiment(@PathVariable Long id) {
        Eksperiment eksperiment = eksperimentServiceJPA.findById(id);
        if (eksperiment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(eksperimentServiceJPA.getShowDTO(eksperiment), HttpStatus.OK);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteExperiment(@PathVariable Long id) {
        Eksperiment eksperiment = eksperimentServiceJPA.findById(id);
        if (eksperiment != null) {
            eksperimentServiceJPA.deleteById(id);
            return new ResponseEntity<>("Eksperiment obrisan uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Eksperiment nije pronađen", HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateExperiment(@PathVariable Long id,
                                                   @RequestPart(value = "name", required = false) String name,
                                                   @RequestPart(value = "field", required = false) String field,
                                                   @RequestPart(value = "subject", required = false) String subject,
                                                   @RequestPart(value = "description", required = false) String description,
                                                   @RequestPart(value = "materials", required = false) String materials,
                                                   @RequestPart(value = "logovi", required = false) String logs,
                                                   @RequestPart(value = "komponente", required = false) String komponenteJson,
                                                   @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                   @RequestPart(value = "deletedFileIds", required = false) String deletedFileIdsJson) {

        Eksperiment eksperiment = eksperimentServiceJPA.findById(id);
        if (eksperiment == null) {
            return new ResponseEntity<>("Eksperiment nije pronađen", HttpStatus.NOT_FOUND);
        }

        EksperimentAddDTO eksperimentAddDTO = new EksperimentAddDTO();
        eksperimentAddDTO.setName(name);
        eksperimentAddDTO.setField(field);
        eksperimentAddDTO.setSubject(subject);
        eksperimentAddDTO.setDescription(description);
        eksperimentAddDTO.setMaterials(materials);

        List<String> componentList = new ArrayList<>();
        if (komponenteJson != null && !komponenteJson.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                componentList = Arrays.asList(objectMapper.readValue(komponenteJson, String[].class));
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

        List<FilesDTO> filesList = new ArrayList<>();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                FilesDTO filesDTO = new FilesDTO();
                filesDTO.setName(file.getOriginalFilename());
                filesDTO.setEntityType("eksperiment");
                filesDTO.setData(file);
                filesDTO.setFileCategory("general");
                filesList.add(filesDTO);
            }
            eksperimentAddDTO.setFiles(filesList);
        }

        List<Long> deletedFilesList = new ArrayList<>();
        if (deletedFileIdsJson != null && !deletedFileIdsJson.isEmpty()) {

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                deletedFilesList = Arrays.asList(objectMapper.readValue(deletedFileIdsJson, Long[].class));
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }
        }


        return new ResponseEntity<>(eksperimentServiceJPA.update(id, eksperimentAddDTO, componentList, logList, deletedFilesList, filesList), HttpStatus.OK);
    }
}
