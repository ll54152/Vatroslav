package com.inventar.backend.controller;

import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.DTO.ErrorResponseDTO;
import com.inventar.backend.domain.File;
import com.inventar.backend.service.FileServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileServiceJPA fileServiceJPA;

    @Autowired
    public FileController(FileServiceJPA fileServiceJPA) {
        this.fileServiceJPA = fileServiceJPA;
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Object> downloadFile(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID datoteke mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        File file = fileServiceJPA.findById(id);

        if (file == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Datoteka nije pronađena", "Datoteka sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }

        if (file.getFileCategory().equals("general")) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(new InputStreamResource(new ByteArrayInputStream(file.getFileByte())));
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeća kategorija datoteke", "Može se preuzeti samo datoteke u kategoriji 'general'"),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/publicImage/{id}")
    public ResponseEntity<Object> getPublicImage(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID slike mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        File file = fileServiceJPA.findById(id);

        if (file == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Slika nije pronađena", "Slika sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }

        if (file.getFileCategory().equals("profileImage") || file.getFileCategory().equals("otherImage") || file.getExperiment().isItPublic()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .body(file.getFileByte());
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.FORBIDDEN.value(), "Pristup odbijen", "Nemate pristup ovoj slici"),
                    HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<Object> getImage(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID slike mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        File file = fileServiceJPA.findById(id);

        if (file == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Slika nije pronađena", "Slika sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }

        if (file.getFileCategory().equals("profileImage") || file.getFileCategory().equals("otherImage")) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .body(file.getFileByte());
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.FORBIDDEN.value(), "Pristup odbijen", "Ova datoteka nije slika"),
                    HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadFile(FileDTO fileDTO) {
        if (fileDTO == null || fileDTO.getData() == null) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeči zahtjev", "Datoteka nije priložena"),
                    HttpStatus.BAD_REQUEST);
        }

        if (fileDTO.getEntityType() == null || fileDTO.getEntityType().isEmpty()) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći tip entiteta", "Tip entiteta mora biti specificiran"),
                    HttpStatus.BAD_REQUEST);
        }

        if (fileDTO.getEntityType().equals("eksperiment")) {
            try {
                File newFile = fileServiceJPA.uploadExperimentFile(fileDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(newFile);
            } catch (Exception ex) {
                return new ResponseEntity<>(
                        new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Greška pri uploadu", ex.getMessage()),
                        HttpStatus.BAD_REQUEST);
            }
        } else if (fileDTO.getEntityType().equals("komponenta")) {
            try {
                File newFile = fileServiceJPA.uploadComponentFile(fileDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(newFile);
            } catch (Exception ex) {
                return new ResponseEntity<>(
                        new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Greška pri uploadu", ex.getMessage()),
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći tip entiteta", "Tip entiteta mora biti 'eksperiment' ili 'komponenta'"),
                    HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteFile(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.BAD_REQUEST.value(), "Nevažeći ID", "ID datoteke mora biti pozitivan broj"),
                    HttpStatus.BAD_REQUEST);
        }

        File file = fileServiceJPA.findById(id);
        if (file != null) {
            fileServiceJPA.deleteById(id);
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.OK.value(), "Uspješno obrisano", "Datoteka je obrisana uspješno"),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Datoteka nije pronađena", "Datoteka sa ID: " + id + " ne postoji"),
                    HttpStatus.NOT_FOUND);
        }
    }

}
