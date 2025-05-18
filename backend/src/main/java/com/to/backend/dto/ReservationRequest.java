package com.to.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ReservationRequest {
    private String userId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private int minCapacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;

    protected ReservationRequest(Builder b) {
        this.userId      = b.userId;
        this.date        = b.date;
        this.startTime   = b.startTime;
        this.endTime     = b.endTime;
        this.purpose     = b.purpose;
        this.minCapacity = b.minCapacity;
        this.softwareIds = b.softwareIds;
        this.equipmentIds= b.equipmentIds;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String userId;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private String purpose;
        private int minCapacity;
        private List<String> softwareIds;
        private List<String> equipmentIds;

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }
        public Builder date(LocalDate date) {
            this.date = date;
            return this;
        }
        public Builder startTime(LocalTime startTime) {
            this.startTime = startTime;
            return this;
        }
        public Builder endTime(LocalTime endTime) {
            this.endTime = endTime;
            return this;
        }
        public Builder purpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public Builder minCapacity(int minCapacity) {
            this.minCapacity = minCapacity;
            return this;
        }
        public Builder softwareIds(List<String> softwareIds) {
            this.softwareIds = softwareIds;
            return this;
        }
        public Builder equipmentIds(List<String> equipmentIds) {
            this.equipmentIds = equipmentIds;
            return this;
        }
        public ReservationRequest build() {
            return new ReservationRequest(this);
        }
    }

    public String getUserId() { return userId; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getPurpose() { return purpose; }
    public int getMinCapacity() { return minCapacity; }
    public List<String> getSoftwareIds() { return softwareIds; }
    public List<String> getEquipmentIds() { return equipmentIds; }
}
