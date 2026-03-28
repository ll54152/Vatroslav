package com.inventar.backend.DTO;

public class KomponentaDTO {

    private Long id;
    private String name;
    private String ZPF;
    private String description;

    public KomponentaDTO(Long id, String name, String ZPF, String description) {
        this.id = id;
        this.name = name;
        this.ZPF = ZPF;
        this.description = description;
    }

    public KomponentaDTO() {
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
