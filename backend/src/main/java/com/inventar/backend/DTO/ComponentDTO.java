package com.inventar.backend.DTO;

import java.util.List;

public class ComponentDTO {

    private Long id;
    private String name;
    private String ZPF;
    private String description;
    private List<String> keywords;

    public ComponentDTO(Long id, String name, String ZPF, String description, List<String> keywords) {
        this.id = id;
        this.name = name;
        this.ZPF = ZPF;
        this.description = description;
        this.keywords = keywords;
    }

    public ComponentDTO() {
    }

    public List<String> getKeywords() {
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords.stream().sorted().toList();
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

    public String getZPF() {
        return ZPF;
    }

    public void setZPF(String ZPF) {
        this.ZPF = ZPF;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
