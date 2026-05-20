package com.inventar.backend.DTO;

import java.util.List;

public class ExperimentPublicShowDTO {

    private Long id;
    private String name;
    private String zpf;
    private String subject;
    private String field;
    private String description;
    private List<String> keywords;
    private String materials;
    private boolean isItPublic;
    private List<ComponentDTO> componentDTOList;
    private List<FileShowDTO> fileShowDTOList;

    public ExperimentPublicShowDTO(Long id, String name, String zpf, String subject, String field, String description, List<String> keywords, String materials, boolean isItPublic, List<ComponentDTO> componentDTOList, List<FileShowDTO> fileShowDTOList) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.subject = subject;
        this.field = field;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
        this.isItPublic = isItPublic;
        this.componentDTOList = componentDTOList;
        this.fileShowDTOList = fileShowDTOList;
    }

    public ExperimentPublicShowDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isItPublic() {
        return isItPublic;
    }

    public void setItPublic(boolean itPublic) {
        isItPublic = itPublic;
    }

    public List<ComponentDTO> getComponentDTOList() {
        return componentDTOList;
    }

    public void setComponentDTOList(List<ComponentDTO> componentDTOList) {
        this.componentDTOList = componentDTOList;
    }

    public List<FileShowDTO> getFileShowDTOList() {
        return fileShowDTOList;
    }

    public void setFileShowDTOList(List<FileShowDTO> fileShowDTOList) {
        this.fileShowDTOList = fileShowDTOList;
    }
}
