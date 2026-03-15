package com.inventar.backend.service;

import com.inventar.backend.DTO.FilesDTO;
import com.inventar.backend.domain.*;
import com.inventar.backend.repo.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Blob;
import java.util.List;
import java.util.Optional;

@Service
public class FilesServiceJPA {

    @Autowired
    private FilesRepo filesRepo;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private EksperimentRepo eksperimentRepo;

    @Autowired
    private AuthenticationServiceJPA authenticationServiceJPA;

    @Autowired
    private KomponentaRepo komponentaRepo;

    @Autowired
    private UserRepo userRepo;

    public Files save(Files file) {
        return filesRepo.save(file);
    }

    public byte[] uploadFile(MultipartFile file) {

        byte[] bytes = null;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return bytes;
    }

    public Files uploadEksperimentFile(FilesDTO filesDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));

        Eksperiment eksperiment = eksperimentRepo.findById(filesDTO.getEntityId()).get();

        byte[] bytes = uploadFile(filesDTO.getData());

        Files file = new Files(
                filesDTO.getName(),
                bytes,
                filesDTO.getData().getContentType(),
                filesDTO.getFileCategory(),
                userRepo.findByEmail(email).get()
        );

        file.setEksperiment(eksperiment);
        return filesRepo.save(file);

    }

    public Files uploadComponentFile(FilesDTO filesDTO) {
        String email = authenticationServiceJPA.getEmailFromToken(request.getHeader("Authorization"));

        Optional<Komponenta> komponenta = komponentaRepo.findById(filesDTO.getEntityId());

        byte[] bytes = uploadFile(filesDTO.getData());

        Files file = new Files(
                filesDTO.getName(),
                bytes,
                filesDTO.getData().getContentType(),
                filesDTO.getFileCategory(),
                userRepo.findByEmail(email).get()
        );

        file.setKomponenta(komponenta.get());

        return filesRepo.save(file);
    }

    public Files findById(Long fileId) {
        return filesRepo.findById(fileId).orElse(null);
    }

    public void deleteById(Long fileId) {
        Files file = filesRepo.findById(fileId).orElse(null);
        if (file != null) {
            filesRepo.delete(file);
        }
    }
}
