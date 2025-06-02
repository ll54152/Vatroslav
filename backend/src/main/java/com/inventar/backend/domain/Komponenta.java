package com.inventar.backend.domain;

import jakarta.persistence.*;

import java.util.*;

@Entity
public class Komponenta {

    @Id
    @GeneratedValue
    private Integer id; //ID

    private String name;    //Naziv

    private String zpf; //Interna oznaka ZPF; Todo: Samo slova, u bacendu dodaj toUpperCase, NEMA BROJEVA, SUSTAV MORA ODBITI BROJEVE

    private String fer; //Interna oznaka FER; Active;Inactive;Unknown

    private int quantity;   //Kolicina

    @ManyToOne
    private Location location;

    @Column(columnDefinition = "TEXT")
    private String description; //Kratak opis

    @OneToMany(mappedBy = "komponenta")
    private List<Log> logs;  //Jedna komponenta može imati više logova

    @OneToMany(mappedBy = "komponenta")
    private List<Files> files;   //Jedna komponenta može imati više fajlova

    @ManyToMany
    @JoinTable(
            name = "komponenta_eksperiment",
            joinColumns = @JoinColumn(name = "komponenta_id"),
            inverseJoinColumns = @JoinColumn(name = "eksperiment_id")
    )
    private List<Eksperiment> eksperimenti; //Jedna komponenta može biti u više eksperimenata

    public Komponenta() {
    }

    public Komponenta(String name, String zpf, String fer, int quantity, Location location, String description, List<Log> logs, List<Eksperiment> eksperimenti) {
        // Konstruktor sa logovima i eksperimentom ali bez files
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.location = location;
        this.description = description;
        this.logs = logs;
        this.eksperimenti = eksperimenti;
    }

    public Komponenta(String name, String zpf, String fer, int quantity, String description, Location location, List<Eksperiment> eksperimenti) {
        // Konstruktor sa eksperimentom ali bez logova i files
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.description = description;
        this.location = location;
        this.eksperimenti = eksperimenti;
    }

    public Komponenta(String name, String zpf, String fer, int quantity, String description, Location location) {
        // Konstruktor bez eksperimenta i logova i files
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.quantity = quantity;
        this.description = description;
        this.location = location;
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

    public String getZpf() {
        return zpf;
    }

    public void setZpf(String zpf) {
        this.zpf = zpf;
    }

    public String getFer() {
        return fer;
    }

    public void setFer(String fer) {
        this.fer = fer;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Log> getLogs() {
        return logs;
    }

    public void setLogs(List<Log> logs) {
        this.logs = logs;
    }

    public List<Files> getFiles() {
        return files;
    }

    public void setFiles(List<Files> files) {
        this.files = files;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<Eksperiment> getEksperimenti() {
        return eksperimenti;
    }

    public void setEksperimenti(List<Eksperiment> eksperimenti) {
        this.eksperimenti = eksperimenti;
    }
}