package com.inventar.backend.service;

import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.DTO.FileShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.User;
import com.inventar.backend.repo.FileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class FileServiceJPA {

    private final FileRepo fileRepo;
    private final ExperimentServiceJPA experimentServiceJPA;
    private final LogServiceJPA logServiceJPA;
    private final ComponentServiceJPA componentServiceJPA;
    private final UserServiceJPA userServiceJPA;

    @Autowired
    public FileServiceJPA(FileRepo fileRepo, ExperimentServiceJPA experimentServiceJPA, LogServiceJPA logServiceJPA, ComponentServiceJPA componentServiceJPA, UserServiceJPA userServiceJPA) {
        this.fileRepo = fileRepo;
        this.experimentServiceJPA = experimentServiceJPA;
        this.logServiceJPA = logServiceJPA;
        this.componentServiceJPA = componentServiceJPA;
        this.userServiceJPA = userServiceJPA;
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

    public File uploadExperimentFile(FileDTO fileDTO) {
        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userServiceJPA.getAuthenticatedUser()
        );

        file.setExperiment(experimentServiceJPA.findById(fileDTO.getEntityId()));
        return fileRepo.save(file);
    }

    public File uploadComponentFile(FileDTO fileDTO) {
        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userServiceJPA.getAuthenticatedUser()
        );

        file.setComponent(componentServiceJPA.findById(fileDTO.getEntityId()));

        return fileRepo.save(file);
    }

    public void handleComponentFiles(Component component, MultipartFile[] files, User user) {
        if (files == null) return;

        for (MultipartFile fileData : files) {
            try {
                File file = new File();
                file.setName(fileData.getOriginalFilename());
                file.setComponent(component);
                file.setFileType(fileData.getContentType());
                file.setFileCategory("general");
                file.setUser(user);
                file.setFileByte(fileData.getBytes());

                fileRepo.save(file);

                logServiceJPA.fileComponentCreation(component, file, user);

            } catch (Exception e) {
                throw new RuntimeException("File upload failed", e);
            }
        }
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

    public void deleteFiles(List<File> fileList) {
        if (fileList == null || fileList.isEmpty()) {
            return;
        } else {
            fileRepo.deleteAll(fileList);
        }
    }

    public List<FileShowDTO> mapFilesToDTOs(List<File> fileList) {
        if (fileList == null) {
            return List.of();
        } else {
            List<FileShowDTO> fileShowDTOList = new ArrayList<>();

            for (File file : fileList) {
                FileShowDTO fileShowDTO = new FileShowDTO();
                fileShowDTO.setId(file.getId());
                fileShowDTO.setName(file.getName());
                fileShowDTO.setFileCategory(file.getFileCategory());
                fileShowDTO.setFileByte(Base64.getEncoder().encodeToString(file.getFileByte()));
                fileShowDTOList.add(fileShowDTO);

                fileShowDTOList.add(fileShowDTO);
            }

            return fileShowDTOList;
        }
    }
}
