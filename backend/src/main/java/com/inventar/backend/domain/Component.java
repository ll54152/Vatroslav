package com.inventar.backend.domain;

import com.inventar.backend.enums.FerStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ElementCollection;

import java.util.List;

@Entity
public class Component {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String zpf;

    private String fer;

    private FerStatus ferStatus;

    @ElementCollection
    private List<String> deprecatedInventoryMarks;

    private int quantity;

    @ManyToOne
    private Location location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    private List<String> keywords;

    @OneToMany(mappedBy = "component")
    private List<Log> logList;

    @OneToMany(mappedBy = "component")
    private List<File> fileList;

    @ManyToMany
    @JoinTable(
            name = "component_experiment",
            joinColumns = @JoinColumn(name = "component_id"),
            inverseJoinColumns = @JoinColumn(name = "experiment_id")
    )
    private List<Experiment> experimentList;

    public Component() {
    }

    public Component(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, Location location, String description, List<String> keywords, List<Log> logList, List<Experiment> experimentList) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.location = location;
        this.description = description;
        this.keywords = keywords;
        this.logList = logList;
        this.experimentList = experimentList;
    }

    public Component(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, String description, List<String> keywords, Location location, List<Experiment> experimentList) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.description = description;
        this.keywords = keywords;
        this.location = location;
        this.experimentList = experimentList;
    }

    public Component(String name, String zpf, String fer, FerStatus ferStatus, List<String> deprecatedInventoryMarks, int quantity, String description, List<String> keywords, Location location) {
        this.name = name;
        this.zpf = zpf;
        this.fer = fer;
        this.ferStatus = ferStatus;
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
        this.quantity = quantity;
        this.description = description;
        this.keywords = keywords;
        this.location = location;
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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getKeywords() {
        return keywords.stream().sorted().toList();
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords.stream().sorted().toList();
    }

    public List<Log> getLogList() {
        return logList;
    }

    public void setLogList(List<Log> logList) {
        this.logList = logList;
    }

    public List<Experiment> getExperimentList() {
        return experimentList;
    }

    public void setExperimentList(List<Experiment> experimentList) {
        this.experimentList = experimentList;
    }

    public List<File> getFileList() {
        return fileList;
    }

    public void setFileList(List<File> fileList) {
        this.fileList = fileList;
    }

    public FerStatus getFerStatus() {
        return ferStatus;
    }

    public void setFerStatus(FerStatus ferStatus) {
        this.ferStatus = ferStatus;
    }

    public List<String> getDeprecatedInventoryMarks() {
        return deprecatedInventoryMarks;
    }

    public void setDeprecatedInventoryMarks(List<String> deprecatedInventoryMarks) {
        this.deprecatedInventoryMarks = deprecatedInventoryMarks;
    }
}