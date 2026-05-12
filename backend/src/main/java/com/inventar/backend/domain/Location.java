package com.inventar.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Location {
    @Id
    @GeneratedValue
    private Long id;

    private String address;

    private String room;
    @OneToMany(mappedBy = "location")
    private List<Component> componentList;

    public Location() {
    }

    public Location(String address, String room, List<Component> componentList) {
        this.address = address;
        this.room = room;
        this.componentList = componentList;
    }

    public Location(String address, String room) {
        this.address = address;
        this.room = room;
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

    public List<Component> getComponentList() {
        return componentList;
    }

    public void setComponentList(List<Component> componentList) {
        this.componentList = componentList;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
