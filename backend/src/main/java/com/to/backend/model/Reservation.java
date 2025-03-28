package com.to.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "reservations")
public class Reservation {
    @Id
    private String id;
    private String userId;
    private String roomId;
    private LocalDate date;
    private String startHour;
    private String endHour;
    private String purpose;
    private int minCapacity;
    private String[] requiredSoftware;
    private String[] requiredEquipment;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStartHour() { return startHour; }
    public void setStartHour(String startHour) { this.startHour = startHour; }

    public String getEndHour() { return endHour; }
    public void setEndHour(String endHour) { this.endHour = endHour; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getMinCapacity() { return minCapacity; }
    public void setMinCapacity(int minCapacity) { this.minCapacity = minCapacity; }

    public String[] getRequiredSoftware() { return requiredSoftware; }
    public void setRequiredSoftware(String[] requiredSoftware) { this.requiredSoftware = requiredSoftware; }

    public String[] getRequiredEquipment() { return requiredEquipment; }
    public void setRequiredEquipment(String[] requiredEquipment) { this.requiredEquipment = requiredEquipment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
