package com.to.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.to.backend.model.utils.ReservationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.List;

@Document(collection = "reservations")
public class Reservation {
    @Id private String id;
    private String userId;
    private String roomId;
    private String recurrenceId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private ZonedDateTime start;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private ZonedDateTime end;

    private String purpose;
    private int minCapacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private ReservationStatus status;

    public Reservation() { }
    public Reservation(String userId, String roomId, ZonedDateTime start,
                       ZonedDateTime end, String purpose, int minCapacity,
                       List<String> softwareIds, List<String> equipmentIds, ReservationStatus status) {
        this.userId = userId;
        this.roomId = roomId;
        this.start = start;
        this.end = end;
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

    public String getRecurrenceId() { return recurrenceId; }
    public void setRecurrenceId(String recurrenceId) { this.recurrenceId = recurrenceId; }

    public ZonedDateTime getStart() { return this.start; }
    public void setStart(ZonedDateTime start) { this.start = start; }

    public ZonedDateTime getEnd() { return this.end; }
    public void setEnd(ZonedDateTime end) { this.end = end; }

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