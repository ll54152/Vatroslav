package com.inventar.backend.controller;

import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.domain.File;
import com.inventar.backend.service.FileServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) {
        File file = fileServiceJPA.findById(id);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        if (file.getFileCategory().equals("general")) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .body(new InputStreamResource(new ByteArrayInputStream(file.getFileByte())));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> image(@PathVariable Long id) {
        File file = fileServiceJPA.findById(id);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        if (file.getFileCategory().equals("profileImage") || file.getFileCategory().equals("otherImage")) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .body(file.getFileByte());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<File> uploadFile(FileDTO fileDTO) {

        if (fileDTO.getEntityType().equals("eksperiment")) {
            File newFile = fileServiceJPA.uploadExperimentFile(fileDTO);

            if (newFile != null) {
                return ResponseEntity.ok(newFile);
            } else {
                return ResponseEntity.badRequest().body(null);
            }

        } else if (fileDTO.getEntityType().equals("komponenta")) {
            File newFile = fileServiceJPA.uploadComponentFile(fileDTO);

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
        File file = fileServiceJPA.findById(id);
        if (file != null) {
            fileServiceJPA.deleteById(id);
            return ResponseEntity.ok("Datoteka je obrisana uspešno");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
