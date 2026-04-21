package com.inventar.backend.DTO;

import java.util.List;

public class ExperimentDTO {

    private Long id;
    private String name;
    private String zpf;
    private String description;
    private List<String> keywords;

    public ExperimentDTO(Long id, String name, String zpf, String description, List<String> keywords) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.description = description;
        this.keywords = keywords;
    }

    public ExperimentDTO() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getZpf() {
        return zpf;
    }

    public void setZpf(String zpf) {
        this.zpf = zpf;
    }

    public List<String> getKeywords() {
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords.stream().sorted().toList();
    }
}
