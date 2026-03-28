package com.inventar.backend.domain;

import jakarta.persistence.*;

import java.util.*;

@Entity
public class Eksperiment {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String zpf;

    private String field;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(columnDefinition = "TEXT")
    private String materials;

    @OneToMany(mappedBy = "eksperiment")
    private List<Files> files;

    @ManyToMany(mappedBy = "eksperimenti")
    private List<Komponenta> komponente;

    @OneToMany(mappedBy = "eksperiment")
    private List<Log> logs;

    public Eksperiment(String name, String zpf, String field, String subject, String description, String keywords, String materials) {
        // Konstruktor koji ne prime logove niti komponente jer se one dodaju naknadno
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
    }

    public Eksperiment(String name, String zpf, String field, String subject, String description, String keywords, String materials, List<Komponenta> komponente, List<Log> logs) {
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
        this.komponente = komponente;
        this.logs = logs;
    }


    public Eksperiment(String name, String zpf, String field, String subject, String description, String keywords, String materials, List<Log> logs) {
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.keywords = keywords;
        this.materials = materials;
        this.logs = logs;
    }

    public Eksperiment() {
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

    public List<Files> getFiles() {
        return files;
    }

    public void setFiles(List<Files> files) {
        this.files = files;
    }

    public List<Komponenta> getKomponente() {
        return komponente;
    }

    public void setKomponente(List<Komponenta> komponente) {
        this.komponente = komponente;
    }

    public String getMaterials() {
        return materials;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public List<Log> getLogs() {
        return logs;
    }

    public void setLogs(List<Log> logs) {
        this.logs = logs;
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