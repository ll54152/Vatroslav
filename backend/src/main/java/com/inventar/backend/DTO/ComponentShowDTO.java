package com.inventar.backend.DTO;

import java.util.List;

public class ComponentShowDTO {

    private Long id;
    private String name;
    private String zpf;
    private String fer;
    private int quantity;
    private LocationDTO locationDTO;
    private String description;
    private List<String> keywords;
    private List<ExperimentShowDTO> experimentShowDTOList;
    private List<LogShowDTO> logShowDTOList;
    private List<FileShowDTO> fileShowDTOList;

    public ComponentShowDTO() {
    }

    public ComponentShowDTO(Long id, String name, String zpf, String fer, int quantity, LocationDTO locationDTO, String description, List<String> keywords, List<ExperimentShowDTO> experimentShowDTOList, List<LogShowDTO> logShowDTOList, List<FileShowDTO> fileShowDTOList) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.locationDTO = locationDTO;
        this.description = description;
        this.keywords = keywords;
        this.experimentShowDTOList = experimentShowDTOList;
        this.logShowDTOList = logShowDTOList;
        this.fileShowDTOList = fileShowDTOList;
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

    public String getFer() {
        return fer;
    }

    public void setFer(String fer) {
        this.fer = fer;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocationDTO getLocationDTO() {
        return locationDTO;
    }

    public void setLocationDTO(LocationDTO locationDTO) {
        this.locationDTO = locationDTO;
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

    public List<ExperimentShowDTO> getExperimentShowDTOList() {
        return experimentShowDTOList;
    }

    public void setExperimentShowDTOList(List<ExperimentShowDTO> experimentShowDTOList) {
        this.experimentShowDTOList = experimentShowDTOList;
    }

    public List<LogShowDTO> getLogShowDTOList() {
        return logShowDTOList;
    }

    public void setLogShowDTOList(List<LogShowDTO> logShowDTOList) {
        this.logShowDTOList = logShowDTOList;
    }

    public List<FileShowDTO> getFileShowDTOList() {
        return fileShowDTOList;
    }

    public void setFileShowDTOList(List<FileShowDTO> fileShowDTOList) {
        this.fileShowDTOList = fileShowDTOList;
    }
}
