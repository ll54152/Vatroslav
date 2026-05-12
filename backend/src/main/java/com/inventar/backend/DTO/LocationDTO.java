package com.inventar.backend.DTO;

public class LocationDTO {

    private Long id;
    private String address;
    private String room;

    public LocationDTO(Long id, String address, String room) {
        this.id = id;
        this.address = address;
        this.room = room;
    }

    public LocationDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
