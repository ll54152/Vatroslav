package com.inventar.backend.service;

import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.File;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.FileRepo;
import com.inventar.backend.repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class FileServiceJPA {

    private FileRepo fileRepo;
    private HttpServletRequest httpServletRequest;
    private ExperimentRepo experimentRepo;
    private AuthenticationServiceJPA authenticationServiceJPA;
    private ComponentRepo componentRepo;
    private UserRepo userRepo;

    @Autowired
    public FileServiceJPA(FileRepo fileRepo, HttpServletRequest httpServletRequest, ExperimentRepo experimentRepo, AuthenticationServiceJPA authenticationServiceJPA, ComponentRepo componentRepo, UserRepo userRepo) {
        this.fileRepo = fileRepo;
        this.httpServletRequest = httpServletRequest;
        this.experimentRepo = experimentRepo;
        this.authenticationServiceJPA = authenticationServiceJPA;
        this.componentRepo = componentRepo;
        this.userRepo = userRepo;
    }

    public File save(File file) {
        return fileRepo.save(file);
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

    public File uploadEksperimentFile(FileDTO fileDTO) {

        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));

        Experiment experiment = experimentRepo.findById(fileDTO.getEntityId()).get();

        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userRepo.findByEmail(email).get()
        );

        file.setExperiment(experiment);
        return fileRepo.save(file);
    }

    public File uploadComponentFile(FileDTO fileDTO) {
        String email = authenticationServiceJPA.getEmailFromToken(httpServletRequest.getHeader("Authorization"));

        Optional<Component> component = componentRepo.findById(fileDTO.getEntityId());

        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userRepo.findByEmail(email).get()
        );

        file.setComponent(component.get());

        return fileRepo.save(file);
    }

    public File findById(Long fileId) {
        return fileRepo.findById(fileId).orElse(null);
    }

    public void deleteById(Long fileId) {
        File file = fileRepo.findById(fileId).orElse(null);
        if (file != null) {
            fileRepo.delete(file);
        }
    }
}
