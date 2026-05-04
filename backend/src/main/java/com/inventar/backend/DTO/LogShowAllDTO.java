package com.inventar.backend.DTO;

import java.time.LocalDateTime;

public class LogShowAllDTO {

    private Long id;
    private String note;
    private LocalDateTime timestamp;
    private boolean deletable;
    private UserShowDTO userShowDTO;

    private ComponentDTO componentDTO;
    private ExperimentDTO experimentDTO;

    public LogShowAllDTO() {
    }

    public LogShowAllDTO(Long id, String note, LocalDateTime timestamp, boolean deletable, UserShowDTO userShowDTO, ComponentDTO componentDTO, ExperimentDTO experimentDTO) {
        this.id = id;
        this.note = note;
        this.timestamp = timestamp;
        this.deletable = deletable;
        this.userShowDTO = userShowDTO;
        this.componentDTO = componentDTO;
        this.experimentDTO = experimentDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }

    public UserShowDTO getUserShowDTO() {
        return userShowDTO;
    }

    public void setUserShowDTO(UserShowDTO userShowDTO) {
        this.userShowDTO = userShowDTO;
    }

    public ComponentDTO getComponentDTO() {
        return componentDTO;
    }

    public void setComponentDTO(ComponentDTO componentDTO) {
        this.componentDTO = componentDTO;
    }

    public ExperimentDTO getExperimentDTO() {
        return experimentDTO;
    }

    public void setExperimentDTO(ExperimentDTO experimentDTO) {
        this.experimentDTO = experimentDTO;
    }
}
