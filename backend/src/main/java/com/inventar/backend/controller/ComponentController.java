package com.inventar.backend.controller;

import com.inventar.backend.DTO.ComponentAddDTO;
import com.inventar.backend.DTO.ComponentDTO;
import com.inventar.backend.DTO.ComponentEditDTO;
import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.service.ComponentServiceJPA;
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
@RequestMapping("/component")
public class ComponentController {

    private final ComponentServiceJPA componentServiceJPA;

    @Autowired
    public ComponentController(ComponentServiceJPA componentServiceJPA) {
        this.componentServiceJPA = componentServiceJPA;
    }

    @PostMapping(value = "/add")
    public ResponseEntity<Long> addComponent(@RequestPart("data") ComponentAddDTO componentAddDTO,
                                             @RequestPart(value = "files", required = false) MultipartFile[] files,
                                             @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
                                             @RequestPart(value = "otherImages", required = false) MultipartFile[] otherImages) {
        Long componentId = componentServiceJPA.save(componentAddDTO, files, profileImage, otherImages);
        return ResponseEntity.status(HttpStatus.CREATED).body(componentId);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<String> editComponent(
            @PathVariable Long id,
            @RequestPart("data") ComponentEditDTO componentEditDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "otherImages", required = false) MultipartFile[] otherImages
    ) {
        componentServiceJPA.edit(id, componentEditDTO, files, profileImage, otherImages);
        return ResponseEntity.ok("Komponenta ažurirana");
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ComponentDTO>> getAllComponents() {
        return new ResponseEntity<>(componentServiceJPA.findAll(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Object> getComponent(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID komponente mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        Component component = componentServiceJPA.findById(id);
        if (component == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Komponenta nije pronađena", "Komponenta sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(componentServiceJPA.getShowDTO(component), HttpStatus.OK);
        }
    }

    @GetMapping("/getByLocationID/{id}")
    public ResponseEntity<Object> getComponentByLocationID(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID lokacije mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        try {
            List<ComponentDTO> componentDTOList = componentServiceJPA.getComponentByLocationID(id);
            return new ResponseEntity<>(componentDTOList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Lokacija nije pronađena", ex.getMessage()),
                    HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComponent(@PathVariable Long id) {
        Component component = componentServiceJPA.findById(id);
        if (component != null) {
            componentServiceJPA.deleteById(id);
            return new ResponseEntity<>("Komponenta obrisana uspješno", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Komponenta nije pronađena", HttpStatus.NOT_FOUND);
        }
    }
}
