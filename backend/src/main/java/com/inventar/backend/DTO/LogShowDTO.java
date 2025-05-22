package com.inventar.backend.DTO;

import com.inventar.backend.domain.User;

import java.time.LocalDateTime;

public class LogShowDTO {

    private Long id;

    private String note;

    private LocalDateTime timestamp;

    private UserShowDTO user;

    public LogShowDTO(Long id, String note, LocalDateTime timestamp, UserShowDTO user) {
        this.id = id;
        this.note = note;
        this.timestamp = timestamp;
        this.user = user;
    }

    public LogShowDTO() {
    }

    public UserShowDTO getUser() {
        return user;
    }

    public void setUser(UserShowDTO user) {
        this.user = user;
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
}
