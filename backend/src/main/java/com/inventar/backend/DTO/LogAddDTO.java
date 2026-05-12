package com.inventar.backend.DTO;

public class LogAddDTO {

    private String note;
    private String entityType;
    private Long entityId;

    public LogAddDTO() {
    }

    public LogAddDTO(String note, String entityType, Long entityId) {
        this.note = note;
        this.entityType = entityType;
        this.entityId = entityId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }
}
