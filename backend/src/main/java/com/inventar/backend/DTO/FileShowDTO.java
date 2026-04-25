package com.inventar.backend.DTO;

public class FileShowDTO {

    private Long id;
    private String name;
    private String fileCategory;

    public FileShowDTO(Long id, String name, String fileCategory) {
        this.id = id;
        this.name = name;
        this.fileCategory = fileCategory;
    }

    public FileShowDTO() {
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

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }
}
