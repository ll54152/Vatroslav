package com.inventar.backend.domain;

import jakarta.persistence.*;

@Entity
public class Files {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Column(columnDefinition = "bytea")
    private byte[] fileByte;

    private String fileType;

    @ManyToOne
    @JoinColumn(name = "komponenta_id")
    private Komponenta komponenta;

    @ManyToOne
    @JoinColumn(name = "eksperiment_id")
    private Eksperiment eksperiment;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;

    public Files(String name, byte[] fileByte, String fileType, Komponenta komponenta, Eksperiment eksperiment, User user) {
        // Konstruktor sa komponentom i eksperimentom
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.komponenta = komponenta;
        this.eksperiment = eksperiment;
        this.user = user;
    }

    public Files(String name, byte[] fileByte, String fileType, Eksperiment eksperiment, User user) {
        // Konstruktor sa eksperimenom
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.eksperiment = eksperiment;
        this.user = user;
    }

    public Files(String name, byte[] fileByte, String fileType, Komponenta komponenta, User user) {
        // Konstruktor sa komponentom
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.komponenta = komponenta;
        this.user = user;
    }

    public Files(String name, byte[] fileByte, String fileType, User user) {
        // Konstruktor bez komponente i eksperimenta
        this.name = name;
        this.fileByte = fileByte;
        this.fileType = fileType;
        this.user = user;
    }

    public Files() {

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

    public byte[] getFileByte() {
        return fileByte;
    }

    public void setFileByte(byte[] fileByte) {
        this.fileByte = fileByte;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Komponenta getKomponenta() {
        return komponenta;
    }

    public void setKomponenta(Komponenta komponenta) {
        this.komponenta = komponenta;
    }

    public Eksperiment getEksperiment() {
        return eksperiment;
    }

    public void setEksperiment(Eksperiment eksperiment) {
        this.eksperiment = eksperiment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}