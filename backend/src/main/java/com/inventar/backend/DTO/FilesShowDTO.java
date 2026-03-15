package com.inventar.backend.DTO;

import com.inventar.backend.domain.Komponenta;

public class FilesShowDTO {

    private Long id;
    private String name;
    private String fileCategory;
    private String fileByte;

    public FilesShowDTO(Long id, String name, String fileCategory, String fileByte) {
        this.id = id;
        this.name = name;
        this.fileCategory = fileCategory;
        this.fileByte = fileByte;
    }

    public FilesShowDTO() {
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

    public String getFileByte() {
        return fileByte;
    }

    public void setFileByte(String fileByte) {
        this.fileByte = fileByte;
    }

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }
}
