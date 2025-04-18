package com.to.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "rooms")
public class Room {
    @Id private String id;
    private String name;
    private int capacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private String location;

    public Room() { }
    public Room(String name, int capacity, List<String> softwareIds, List<String> equipmentIds, String location) {
        this.name = name;
        this.capacity = capacity;
        this.softwareIds = softwareIds;
        this.equipmentIds = equipmentIds;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public List<String> getSoftwareIds() { return softwareIds; }
    public void setSoftwareIds(List<String> softwareIds) { this.softwareIds = softwareIds; }

    public List<String> getEquipmentIds() { return equipmentIds; }
    public void setEquipmentIds(List<String> equipmentIds) { this.equipmentIds = equipmentIds; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
