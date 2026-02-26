package com.inventar.backend.domain;

import jakarta.persistence.*;

import java.time.*;

@Entity
public class Log {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "komponenta_id")
    private Komponenta komponenta;

    @ManyToOne
    @JoinColumn(name = "eksperiment_id")
    private Eksperiment eksperiment;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;


    public Log() {
    }

    public Log(String note, LocalDateTime timestamp) {
        this.note = note;
        this.timestamp = timestamp;
    }

    public Log(Eksperiment eksperiment, String note, LocalDateTime timestamp, User user) {
        // Konstruktor za eksperiment
        this.eksperiment = eksperiment;
        this.note = note;
        this.timestamp = timestamp;
        this.user = user;
    }

    public Log(Komponenta komponenta, String note, LocalDateTime timestamp, User user) {
        // Konstruktor za komponentu
        this.komponenta = komponenta;
        this.note = note;
        this.timestamp = timestamp;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
