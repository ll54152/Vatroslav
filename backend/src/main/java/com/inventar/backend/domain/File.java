package com.inventar.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.Basic;
import jakarta.persistence.FetchType;

@Entity
public class File {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String fileType;

    private String fileCategory;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "bytea")
    private byte[] fileByte;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;

    @ManyToOne
    @JoinColumn(name = "experiment_id")
    private Experiment experiment;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;

    public File(String name, byte[] fileByte, String fileType, String fileCategory, Component component, Experiment experiment, User user) {
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.fileCategory = fileCategory;
        this.component = component;
        this.experiment = experiment;
        this.user = user;
    }

    public File(String name, byte[] fileByte, String fileType, String fileCategory, Experiment experiment, User user) {
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.fileCategory = fileCategory;
        this.experiment = experiment;
        this.user = user;
    }

    public File(String name, byte[] fileByte, String fileType, String fileCategory, Component component, User user) {
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.fileCategory = fileCategory;
        this.component = component;
        this.user = user;
    }

    public File(String name, byte[] fileByte, String fileType, String fileCategory, User user) {
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.fileCategory = fileCategory;
        this.user = user;
    }

    public File() {
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

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }

    public byte[] getFileByte() {
        return fileByte;
    }

    public void setFileByte(byte[] fileByte) {
        this.fileByte = fileByte;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }

    public Experiment getExperiment() {
        return experiment;
    }

    public void setExperiment(Experiment experiment) {
        this.experiment = experiment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}