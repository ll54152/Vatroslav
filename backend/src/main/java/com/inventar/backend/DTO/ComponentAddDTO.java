package com.inventar.backend.DTO;

import java.util.List;

public class ComponentAddDTO {

    private String name;
    private String zpf;
    private String fer;
    private int quantity;
    private Long locationID;
    private String description;
    private String keywords;
    private String log;
    private List<ExperimentDTO> experimentDTOList;
    private List<FileDTO> fileDTOList;

    public ComponentAddDTO(String name, String zpf, String fer, int quantity, Long locationID, String description, String keywords, String log, List<ExperimentDTO> experimentDTOList, List<FileDTO> fileDTOList) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
        this.experimentDTOList = experimentDTOList;
        this.fileDTOList = fileDTOList;
    }

    public ComponentAddDTO() {
    }

    public ComponentAddDTO(String name, String zpf, String fer, int quantity, Long locationID, String description, String keywords, String log, List<ExperimentDTO> experimentDTOList) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
        this.experimentDTOList = experimentDTOList;
    }

    public ComponentAddDTO(String name, String zpf, String fer, int quantity, Long locationID, String description, String keywords, String log) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
    }

    public ComponentAddDTO(String name, String zpf, String fer, int quantity, Long locationID, String description) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
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

    public Long getLocationID() {
        return locationID;
    }

    public void setLocationID(Long locationID) {
        this.locationID = locationID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public List<ExperimentDTO> getExperimentDTOList() {
        return experimentDTOList;
    }

    public void setExperimentDTOList(List<ExperimentDTO> experimentDTOList) {
        this.experimentDTOList = experimentDTOList;
    }

    public List<FileDTO> getFileDTOList() {
        return fileDTOList;
    }

    public void setFileDTOList(List<FileDTO> fileDTOList) {
        this.fileDTOList = fileDTOList;
    }
}
