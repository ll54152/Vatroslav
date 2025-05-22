package com.inventar.backend.DTO;

import com.inventar.backend.domain.Komponenta;

public class FilesShowDTO {

    private Long id;
    private String name;
    private String fileByte;

    public FilesShowDTO(Long id, String name, String fileByte) {
        this.id = id;
        this.name = name;
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
}
