package com.inventar.backend.DTO;

import java.util.List;

public class ExperimentAddDTO {

    private String name;
    private String zpf;
    private String subject;
    private String field;
    private String description;
    private List<String> keywords;
    private String materials;
    private List<Long> componentIds;
    private List<FileDTO> fileDTOList;

    public ExperimentAddDTO() {
    }

    public ExperimentAddDTO(String name, String zpf, String subject, String field, String description, List<String> keywords, String materials, List<Long> componentIds, List<FileDTO> fileDTOList) {
        this.name = name;
        this.zpf = zpf;
        this.subject = subject;
        this.field = field;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
        this.componentIds = componentIds;
        this.fileDTOList = fileDTOList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getZpf() {
        return zpf;
    }

    public void setZpf(String zpf) {
        this.zpf = zpf;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public List<FileDTO> getFileDTOList() {
        return fileDTOList;
    }

    public void setFileDTOList(List<FileDTO> fileDTOList) {
        this.fileDTOList = fileDTOList;
    }

    public List<Long> getComponentIds() {
        return componentIds;
    }

    public void setComponentIds(List<Long> componentIds) {
        this.componentIds = componentIds;
    }
}
