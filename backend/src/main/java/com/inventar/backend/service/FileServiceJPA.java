package com.inventar.backend.service;

import com.inventar.backend.DTO.FileDTO;
import com.inventar.backend.DTO.FileShowDTO;
import com.inventar.backend.domain.Component;
import com.inventar.backend.domain.Experiment;
import com.inventar.backend.domain.File;
import com.inventar.backend.domain.User;
import com.inventar.backend.repo.ComponentRepo;
import com.inventar.backend.repo.ExperimentRepo;
import com.inventar.backend.repo.FileRepo;
import jakarta.transaction.Transactional;
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
    private final ExperimentRepo experimentRepo;
    private final ComponentRepo componentRepo;

    private final LogServiceJPA logServiceJPA;
    private final UserServiceJPA userServiceJPA;

    @Autowired
    public FileServiceJPA(FileRepo fileRepo, ExperimentRepo experimentRepo, LogServiceJPA logServiceJPA, ComponentRepo componentRepo, UserServiceJPA userServiceJPA) {
        this.fileRepo = fileRepo;
        this.experimentRepo = experimentRepo;
        this.logServiceJPA = logServiceJPA;
        this.componentRepo = componentRepo;
        this.userServiceJPA = userServiceJPA;
    }

    public File save(File file) {
        return fileRepo.save(file);
    }

    @Transactional
    public byte[] uploadFile(MultipartFile file) {
        byte[] bytes = null;

        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return bytes;
    }

    @Transactional
    public File uploadExperimentFile(FileDTO fileDTO) {
        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userServiceJPA.getAuthenticatedUser()
        );

        file.setExperiment(experimentRepo.findById(fileDTO.getEntityId()).orElseThrow(() -> new RuntimeException("Experiment not found")));
        return fileRepo.save(file);
    }

    @Transactional
    public File uploadComponentFile(FileDTO fileDTO) {
        byte[] bytes = uploadFile(fileDTO.getData());

        File file = new File(
                fileDTO.getName(),
                bytes,
                fileDTO.getData().getContentType(),
                fileDTO.getFileCategory(),
                userServiceJPA.getAuthenticatedUser()
        );

        file.setComponent(componentRepo.findById(fileDTO.getEntityId()).orElseThrow(() -> new RuntimeException("Location not found")));

        return fileRepo.save(file);
    }

    @Transactional
    public void handleComponentFiles(Component component, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages, User user) {
        List<MultipartFile> multipartFiles = new ArrayList<>();

        if (files != null) {
            multipartFiles.addAll(List.of(files));
        }

        if (profileImage != null) {
            multipartFiles.add(profileImage);
        }

        if (otherImages != null) {
            multipartFiles.addAll(List.of(otherImages));
        }

        for (MultipartFile multipartFile : multipartFiles) {
            try {
                File file = new File();
                file.setName(multipartFile.getOriginalFilename());
                file.setComponent(component);
                file.setFileType(multipartFile.getContentType());

                if (multipartFile.equals(profileImage)) {
                    file.setFileCategory("profileImage");
                } else if (otherImages != null && List.of(otherImages).contains(multipartFile)) {
                    file.setFileCategory("otherImage");
                } else {
                    file.setFileCategory("general");
                }

                file.setUser(user);
                file.setFileByte(multipartFile.getBytes());

                fileRepo.save(file);
                logServiceJPA.fileComponentCreation(component, file, user);

            } catch (Exception e) {
                throw new RuntimeException("File upload failed", e);
            }
        }
    }

    @Transactional
    public void syncComponentFiles(Component component,
                                   List<Long> existingFileIds,
                                   MultipartFile[] files,
                                   MultipartFile profileImage,
                                   MultipartFile[] otherImages,
                                   User user) {

        List<File> currentFiles = component.getFileList() != null
                ? component.getFileList()
                : new ArrayList<>();

        for (File file : new ArrayList<>(currentFiles)) {

            if (existingFileIds == null || !existingFileIds.contains(file.getId())) {

                fileRepo.delete(file);

                logServiceJPA.fileComponentDeletion(component, file, user);
            }
        }

        handleComponentFiles(component, files, profileImage, otherImages, user);
    }

    @Transactional
    public void syncExperimentFiles(Experiment experiment, List<Long> existingFileIds, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages, User user) {
        List<File> currentFiles = experiment.getFileList() != null
                ? experiment.getFileList()
                : new ArrayList<>();

        for (File file : new ArrayList<>(currentFiles)) {

            if (existingFileIds == null || !existingFileIds.contains(file.getId())) {

                fileRepo.delete(file);

                logServiceJPA.fileExperimentDeletion(experiment, file, user);
            }
        }

        handleExperimentFiles(experiment, files, profileImage, otherImages, user);
    }

    @Transactional
    public void handleExperimentFiles(Experiment experiment, MultipartFile[] files, MultipartFile profileImage, MultipartFile[] otherImages, User user) {
        List<MultipartFile> multipartFiles = new ArrayList<>();

        if (files != null) {
            multipartFiles.addAll(List.of(files));
        }

        if (profileImage != null) {
            multipartFiles.add(profileImage);
        }

        if (otherImages != null) {
            multipartFiles.addAll(List.of(otherImages));
        }

        for (MultipartFile multipartFile : multipartFiles) {
            try {
                File file = new File();
                file.setName(multipartFile.getOriginalFilename());
                file.setExperiment(experiment);
                file.setFileType(multipartFile.getContentType());

                if (multipartFile.equals(profileImage)) {
                    file.setFileCategory("profileImage");
                } else if (otherImages != null && List.of(otherImages).contains(multipartFile)) {
                    file.setFileCategory("otherImage");
                } else {
                    file.setFileCategory("general");
                }

                file.setUser(user);
                file.setFileByte(multipartFile.getBytes());

                fileRepo.save(file);
                logServiceJPA.fileExperimentCreation(experiment, file, user);

            } catch (Exception e) {
                throw new RuntimeException("File upload failed", e);
            }
        }

    }

    public File findById(Long fileId) {
        return fileRepo.findById(fileId).orElse(null);
    }

    @Transactional
    public void deleteById(Long fileId) {
        File file = fileRepo.findById(fileId).orElse(null);
        if (file != null) {
            fileRepo.delete(file);
        }
    }

    @Transactional
    public void deleteFiles(List<File> fileList) {
        if (fileList != null && !fileList.isEmpty()) {
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
                //fileShowDTO.setFileByte(Base64.getEncoder().encodeToString(file.getFileByte()));

                fileShowDTOList.add(fileShowDTO);
            }

            return fileShowDTOList;
        }
    }


}
