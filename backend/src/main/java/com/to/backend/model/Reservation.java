package com.to.backend.model;

import com.to.backend.model.utils.ReservationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "reservations")
public class Reservation {
    @Id private String id;
    private String userId;
    private String roomId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private int minCapacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private ReservationStatus status;

    public Reservation() { }
    public Reservation(String userId, String roomId, LocalDate date, LocalTime startTime,
                       LocalTime endTime, String purpose, int minCapacity,
                       List<String> softwareIds, List<String> equipmentIds, ReservationStatus status) {
        this.userId = userId;
        this.roomId = roomId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.minCapacity = minCapacity;
        this.softwareIds = softwareIds;
        this.equipmentIds = equipmentIds;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getMinCapacity() { return minCapacity; }
    public void setMinCapacity(int minCapacity) { this.minCapacity = minCapacity; }

    public List<String> getSoftwareIds() { return softwareIds; }
    public void setSoftwareIds(List<String> softwareIds) { this.softwareIds = softwareIds; }

    public List<String> getEquipmentIds() { return equipmentIds; }
    public void setEquipmentIds(List<String> equipmentIds) { this.equipmentIds = equipmentIds; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }
}