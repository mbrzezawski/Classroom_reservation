package com.to.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String name;
    private int capacity;
    private List<String> software;
    private List<String> equipment;
    private String location;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public List<String> getSoftware() { return software; }
    public void setSoftware(List<String> software) { this.software = software; }

    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
