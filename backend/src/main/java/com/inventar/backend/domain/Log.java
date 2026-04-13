package com.inventar.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;

import java.time.LocalDateTime;

@Entity
public class Log {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;

    @ManyToOne
    @JoinColumn(name = "experiment_id")
    private Experiment experiment;

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

    public Log(Experiment experiment, String note, LocalDateTime timestamp, User user) {
        this.experiment = experiment;
        this.note = note;
        this.timestamp = timestamp;
        this.user = user;
    }

    public Log(Component component, String note, LocalDateTime timestamp, User user) {
        this.component = component;
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
