package com.inventar.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ElementCollection;

import java.util.List;

@Entity
public class Experiment {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String zpf;

    private String subject;

    private String field;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    private List<String> keywords;

    @Column(columnDefinition = "TEXT")
    private String materials;

    @OneToMany(mappedBy = "experiment")
    private List<File> fileList;

    @ManyToMany(mappedBy = "experimentList")
    private List<Component> componentList;

    @OneToMany(mappedBy = "experiment")
    private List<Log> logList;

    public Experiment(String name, String zpf, String field, String subject, String description, List<String> keywords, String materials) {
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.setKeywords(keywords);
        this.materials = materials;
    }

    public Experiment(String name, String zpf, String field, String subject, String description, List<String> keywords, String materials, List<Component> componentList, List<Log> logList) {
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.setKeywords(keywords);
        this.materials = materials;
        this.componentList = componentList;
        this.logList = logList;
    }


    public Experiment(String name, String zpf, String field, String subject, String description, List<String> keywords, String materials, List<Log> logList) {
        this.name = name;
        this.zpf = zpf;
        this.field = field;
        this.subject = subject;
        this.description = description;
        this.setKeywords(keywords);
        this.materials = materials;
        this.logList = logList;
    }

    public Experiment() {
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

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
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

    public List<Component> getComponentList() {
        return componentList;
    }

    public void setComponentList(List<Component> componentList) {
        this.componentList = componentList;
    }

    public List<Log> getLogList() {
        return logList;
    }

    public void setLogList(List<Log> logList) {
        this.logList = logList;
    }

    public List<File> getFileList() {
        return fileList;
    }

    public void setFileList(List<File> fileList) {
        this.fileList = fileList;
    }

    public List<String> getKeywords() {
        if (keywords == null) {
            return null;
        }
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        if (keywords != null) {
            this.keywords = new java.util.ArrayList<>(keywords.stream().sorted().toList());
        } else {
            this.keywords = null;
        }
    }
}