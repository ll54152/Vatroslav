package com.inventar.backend.DTO;

import org.springframework.web.multipart.MultipartFile;

public class FilesDTO {

    private String name;
    private MultipartFile data;
    private String entityType;
    private String fileCategory;
    private Long entityId;

    public FilesDTO() {
    }

    public FilesDTO(String name, MultipartFile data) {
        this.name = name;
        this.data = data;
    }

    public FilesDTO(String name, MultipartFile data, String entityType, String fileCategory, Long entityId) {
        this.name = name;
        this.data = data;
        this.entityType = entityType;
        this.fileCategory = fileCategory;
        this.entityId = entityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getData() {
        return data;
    }

    public void setData(MultipartFile data) {
        this.data = data;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }
}
