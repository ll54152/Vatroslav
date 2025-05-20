package com.inventar.backend.DTO;

import java.util.*;

public class EksperimentAddDTO {
    private String name;

    private String field;

    private String subject;

    private String description;

    private String materials;

    private List<KomponentaDTO> komponente;

    private List<FilesDTO> files;

    public EksperimentAddDTO() {
    }

    public EksperimentAddDTO(String name, String field, String subject, String description, String materials, List<KomponentaDTO> komponente, List<FilesDTO> files) {
        this.name = name;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.materials = materials;
        this.komponente = komponente;
        this.files = files;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public List<KomponentaDTO> getKomponente() {
        return komponente;
    }

    public void setKomponente(List<KomponentaDTO> komponente) {
        this.komponente = komponente;
    }

    public List<FilesDTO> getFiles() {
        return files;
    }

    public void setFiles(List<FilesDTO> files) {
        this.files = files;
    }
}
