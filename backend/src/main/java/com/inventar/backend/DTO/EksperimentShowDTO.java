package com.inventar.backend.DTO;

import java.util.List;

public class EksperimentShowDTO {

    private Long id;
    private String name;
    private String zpf;
    private String field;
    private String subject;
    private String description;
    private String keywords;
    private String materials;

    private List<KomponentaShowDTO> komponente;

    private List<LogShowDTO> logs;

    private List<FilesShowDTO> files;

    public EksperimentShowDTO(Long id, String name, String zpf, String field, String subject, String description, String keywords, String materials, List<KomponentaShowDTO> komponente, List<LogShowDTO> logs, List<FilesShowDTO> files) {
        this.id = id;
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
        this.komponente = komponente;
        this.logs = logs;
        this.files = files;
    }

    public EksperimentShowDTO() {
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

    public List<KomponentaShowDTO> getKomponente() {
        return komponente;
    }

    public void setKomponente(List<KomponentaShowDTO> komponente) {
        this.komponente = komponente;
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
