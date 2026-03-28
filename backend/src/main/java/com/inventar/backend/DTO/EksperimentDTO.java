package com.inventar.backend.DTO;

public class EksperimentDTO {
    private Long id;

    private String name;

    private String zpf;

    private String description;

    private String keywords;

    public EksperimentDTO(Long id, String name, String zpf, String description, String keywords) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.description = description;
        this.keywords = keywords;
    }

    public EksperimentDTO() {
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

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
}
