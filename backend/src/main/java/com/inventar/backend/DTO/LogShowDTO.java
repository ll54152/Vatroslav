package com.inventar.backend.DTO;

import java.time.LocalDateTime;

public class LogShowDTO {

    private Long id;
    private String note;
    private LocalDateTime timestamp;
    private UserShowDTO userShowDTO;

    public LogShowDTO(Long id, String note, LocalDateTime timestamp, UserShowDTO userShowDTO) {
        this.id = id;
        this.note = note;
        this.timestamp = timestamp;
        this.userShowDTO = userShowDTO;
    }

    public LogShowDTO() {
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

    public UserShowDTO getUserShowDTO() {
        return userShowDTO;
    }

    public void setUserShowDTO(UserShowDTO userShowDTO) {
        this.userShowDTO = userShowDTO;
    }
}
