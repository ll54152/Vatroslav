package com.inventar.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
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
@RequestMapping("/component")
public class KomponentaController {

    @Autowired
    private KomponentaServiceJPA komponentaServiceJPA;

    @Autowired
    private EksperimentServiceJPA eksperimentServiceJPA;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addComponent(
            @RequestPart("name") String name,
            @RequestPart("zpf") String zpf,
            @RequestPart("fer") String fer,
            @RequestPart("quantity") String quantityStr,
            @RequestPart("locationID") String locationIDStr,
            @RequestPart("description") String description,
            @RequestPart("keywords") String keywords,
            @RequestPart("eksperimentIDs") String eksperimentIDsJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        KomponentaAddDTO komponentaAddDTO = new KomponentaAddDTO();
        komponentaAddDTO.setName(name);
        komponentaAddDTO.setZpf(zpf);
        komponentaAddDTO.setFer(fer);
        komponentaAddDTO.setKeywords(keywords);
        komponentaAddDTO.setQuantity(Integer.parseInt(quantityStr));
        komponentaAddDTO.setLocationID(Integer.parseInt(locationIDStr));
        komponentaAddDTO.setDescription(description);


        if (eksperimentIDsJson != null && !eksperimentIDsJson.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                List<Integer> ids = objectMapper.readValue(eksperimentIDsJson, new TypeReference<>() {
                });
                List<EksperimentDTO> eksperimentsDTO = new ArrayList<>();
                for (Integer id : ids) {
                    Eksperiment eksperiment = eksperimentServiceJPA.findById(Long.valueOf(id));
                    if (eksperiment != null) {
                        eksperimentsDTO.add(new EksperimentDTO(eksperiment.getId(), eksperiment.getName(), eksperiment.getZpf(), eksperiment.getDescription(), eksperiment.getKeywords()));
                    }
                }
                komponentaAddDTO.setEksperiments(eksperimentsDTO);
            } catch (Exception e) {
                return new ResponseEntity<>("Greška prilikom parsiranja JSON-a", HttpStatus.BAD_REQUEST);
            }

        }

        if (files != null && files.length > 0) {
            List<FilesDTO> filesDTOList = new ArrayList<>();
            for (MultipartFile file : files) {
                FilesDTO filesDTO = new FilesDTO();
                filesDTO.setName(file.getOriginalFilename());
                filesDTO.setEntityType("eksperiment");
                filesDTO.setData(file);
                filesDTO.setFileCategory("general");
                filesDTOList.add(filesDTO);
            }
            komponentaAddDTO.setFiles(filesDTOList);
        }
        komponentaServiceJPA.save(komponentaAddDTO);
        return new ResponseEntity<>("Komponenta dodata uspešno", HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<KomponentaDTO>> getAllComponents() {
        List<KomponentaDTO> komponentaDTOs = komponentaServiceJPA.findAll().stream()
                .map(komponenta -> new KomponentaDTO(komponenta.getId(), komponenta.getName(), komponenta.getZpf(), komponenta.getDescription(), komponenta.getKeywords()))
                .toList();
        return new ResponseEntity<>(komponentaDTOs, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<KomponentaShowDTO> getComponent(@PathVariable Long id) {
        Komponenta komponenta = komponentaServiceJPA.findById(id);
        if (komponenta == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(komponentaServiceJPA.getShowDTO(komponenta), HttpStatus.OK);
        }


    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComponent(@PathVariable Long id) {
        Komponenta komponenta = komponentaServiceJPA.findById(id);
        if (komponenta != null) {
            komponentaServiceJPA.deleteById(id);
            return new ResponseEntity<>("Komponenta obrisana uspešno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Komponenta nije pronađena", HttpStatus.NOT_FOUND);
        }
    }
}
