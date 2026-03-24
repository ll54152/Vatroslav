package com.inventar.backend.DTO;

public class KomponentaDTO {

    private Integer id;
    private String name;
    private String ZPF;
    private String description;

    public KomponentaDTO(Integer id, String name, String ZPF, String description) {
        this.id = id;
        this.name = name;
        this.ZPF = ZPF;
        this.description = description;
    }

    public KomponentaDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
