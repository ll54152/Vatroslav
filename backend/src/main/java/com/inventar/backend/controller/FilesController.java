package com.inventar.backend.controller;

import com.inventar.backend.DTO.FilesDTO;
import com.inventar.backend.domain.Files;
import com.inventar.backend.service.FilesServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/files")
public class FilesController {

    @Autowired
    private FilesServiceJPA filesServiceJPA;

    @PostMapping("/upload")
    public ResponseEntity<Files> uploadFile(FilesDTO filesDTO) {

        if (filesDTO.getEntityType().equals("eksperiment")) {
            Files newFile = filesServiceJPA.uploadEksperimentFile(filesDTO);

            if (newFile != null) {
                return ResponseEntity.ok(newFile);
            } else {
                return ResponseEntity.badRequest().body(null);
            }

        } else if (filesDTO.getEntityType().equals("komponenta")) {
            Files newFile = filesServiceJPA.uploadComponentFile(filesDTO);

            if (newFile != null) {
                return ResponseEntity.ok(newFile);
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            return ResponseEntity.badRequest().body(null);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        Files file = filesServiceJPA.findById(id);
        if (file != null) {
            filesServiceJPA.deleteById(id);
            return ResponseEntity.ok("Datoteka je obrisana uspešno");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
