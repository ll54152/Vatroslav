package com.inventar.backend.DTO;

import com.inventar.backend.enums.FerStatus;

import java.util.List;

public class ComponentShowDTO {

    private Long id;
    private String name;
    private String zpf;
    private String fer;
    private FerStatus ferStatus;
    private List<String> deprecatedInventoryMarks;
    private int quantity;
    private LocationDTO locationDTO;
    private String description;
    private List<String> keywords;
    private List<ExperimentDTO> experimentDTOList;
    private List<LogShowDTO> logShowDTOList;
    private List<FileShowDTO> fileShowDTOList;

    public ComponentShowDTO() {
    }

    public ComponentShowDTO(Long id, String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, LocationDTO locationDTO, String description, List<String> keywords, List<ExperimentDTO> experimentDTOList, List<LogShowDTO> logShowDTOList, List<FileShowDTO> fileShowDTOList) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.locationDTO = locationDTO;
        this.description = description;
        this.keywords = keywords;
        this.experimentDTOList = experimentDTOList;
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
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords.stream().sorted().toList();
    }

    public List<ExperimentDTO> getExperimentDTOList() {
        return experimentDTOList;
    }

    public void setExperimentDTOList(List<ExperimentDTO> experimentDTOList) {
        this.experimentDTOList = experimentDTOList;
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

    public FerStatus getFerStatus() {
        return ferStatus;
    }

    public void setFerStatus(FerStatus ferStatus) {
        this.ferStatus = ferStatus;
    }

    public List<String> getDeprecatedInventoryMarks() {
        return deprecatedInventoryMarks;
    }

    public void setDeprecatedInventoryMarks(List<String> deprecatedInventoryMarks) {
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
    }
}
