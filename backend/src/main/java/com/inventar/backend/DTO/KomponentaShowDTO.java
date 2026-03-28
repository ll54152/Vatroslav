package com.inventar.backend.DTO;

import java.util.*;

public class KomponentaShowDTO {

    private Long id;

    private String name;

    private String zpf;

    private String fer;

    private int quantity;

    private LocationDTO location;

    private String description;

    private String keywords;

    private List<EksperimentShowDTO> eksperimenti;

    private List<LogShowDTO> logs;

    private List<FilesShowDTO> files;

    public KomponentaShowDTO() {
    }

    public KomponentaShowDTO(Long id, String name, String zpf, String fer, int quantity, LocationDTO location, String description, String keywords, List<EksperimentShowDTO> eksperimenti, List<LogShowDTO> logs, List<FilesShowDTO> files) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.location = location;
        this.description = description;
        this.keywords = keywords;
        this.eksperimenti = eksperimenti;
        this.logs = logs;
        this.files = files;
    }

    public List<EksperimentShowDTO> getEksperimenti() {
        return eksperimenti;
    }

    public void setEksperimenti(List<EksperimentShowDTO> eksperimenti) {
        this.eksperimenti = eksperimenti;
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

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<LogShowDTO> getLogs() {
        return logs;
    }

    public void setLogs(List<LogShowDTO> logs) {
        this.logs = logs;
    }

    public List<FilesShowDTO> getFiles() {
        return files;
    }

    public void setFiles(List<FilesShowDTO> files) {
        this.files = files;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
