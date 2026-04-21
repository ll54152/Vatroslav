package com.inventar.backend.DTO;

import com.inventar.backend.enums.FerStatus;

import java.util.List;

public class ComponentAddDTO {

    private String name;
    private String zpf;
    private String fer;
    private FerStatus ferStatus;
    private List<String> deprecatedInventoryMarks;
    private int quantity;
    private Long locationID;
    private String description;
    private List<String> keywords;
    private String log;
    private List<Long> experimentIds;
    private List<FileDTO> fileDTOList;

    public ComponentAddDTO(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, Long locationID, String description, List<String> keywords, String log, List<Long> experimentIds, List<FileDTO> fileDTOList) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
        this.experimentIds = experimentIds;
        this.fileDTOList = fileDTOList;
    }

    public ComponentAddDTO() {
    }

    public ComponentAddDTO(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, Long locationID, String description, List<String> keywords, String log, List<Long> experimentIds) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
        this.experimentIds = experimentIds;
    }

    public ComponentAddDTO(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, Long locationID, String description, List<String> keywords, String log) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.locationID = locationID;
        this.description = description;
        this.keywords = keywords;
        this.log = log;
    }

    public ComponentAddDTO(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, Long locationID, String description) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
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

    public List<String> getKeywords() {
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords.stream().sorted().toList();
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public List<FileDTO> getFileDTOList() {
        return fileDTOList;
    }

    public void setFileDTOList(List<FileDTO> fileDTOList) {
        this.fileDTOList = fileDTOList;
    }

    public List<Long> getExperimentIds() {
        return experimentIds;
    }

    public void setExperimentIds(List<Long> experimentIds) {
        this.experimentIds = experimentIds;
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
