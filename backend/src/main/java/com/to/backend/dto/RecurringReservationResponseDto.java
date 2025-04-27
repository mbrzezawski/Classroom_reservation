package com.to.backend.dto;

import com.to.backend.model.utils.Frequency;
import com.to.backend.model.utils.ReservationStatus;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class RecurringReservationResponseDto {
    private String recurringReservationId;
    private String roomId;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private int minCapacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private Frequency frequency;
    private int interval;
    private List<DayOfWeek> byDays;
    private ReservationStatus status;
    private List<ReservationResponse> reservations;

    protected RecurringReservationResponseDto(Builder b) {
        this.recurringReservationId = b.recurringReservationId;
        this.roomId = b.roomId;
        this.startDate = b.startDate;
        this.endDate = b.endDate;
        this.startTime = b.startTime;
        this.endTime = b.endTime;
        this.purpose = b.purpose;
        this.minCapacity = b.minCapacity;
        this.softwareIds = b.softwareIds;
        this.equipmentIds = b.equipmentIds;
        this.frequency = b.frequency;
        this.interval = b.interval;
        this.byDays = b.byDays;
        this.status = b.status;
        this.reservations = b.reservations;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String recurringReservationId;
        private String roomId;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String purpose;
        private int minCapacity;
        private List<String> softwareIds;
        private List<String> equipmentIds;
        private Frequency frequency;
        private int interval;
        private List<DayOfWeek> byDays;
        private ReservationStatus status;
        private List<ReservationResponse> reservations;

        public Builder recurringReservationId(String id) {
            this.recurringReservationId = id;
            return this;
        }
        public Builder roomId(String roomId) { this.roomId = roomId; return this; }
        public Builder startDate(LocalDate d) { this.startDate = d; return this; }
        public Builder endDate(LocalDate d) { this.endDate = d; return this; }
        public Builder startTime(LocalTime t) { this.startTime = t; return this; }
        public Builder endTime(LocalTime t) { this.endTime = t; return this; }
        public Builder purpose(String p) { this.purpose = p; return this; }
        public Builder minCapacity(int c) { this.minCapacity = c; return this; }
        public Builder softwareIds(List<String> list) { this.softwareIds = list; return this; }
        public Builder equipmentIds(List<String> list) { this.equipmentIds = list; return this; }
        public Builder frequency(Frequency f) { this.frequency = f; return this; }
        public Builder interval(int i) { this.interval = i; return this; }
        public Builder byDays(List<DayOfWeek> days) { this.byDays = days; return this; }
        public Builder status(ReservationStatus s) { this.status = s; return this; }
        public Builder reservations(List<ReservationResponse> rs) { this.reservations = rs; return this; }
        public RecurringReservationResponseDto build() {
            return new RecurringReservationResponseDto(this);
        }
    }

    // getters
    public String getRecurringReservationId() { return recurringReservationId; }
    public String getRoomId() { return roomId; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getPurpose() { return purpose; }
    public int getMinCapacity() { return minCapacity; }
    public List<String> getSoftwareIds() { return softwareIds; }
    public List<String> getEquipmentIds() { return equipmentIds; }
    public Frequency getFrequency() { return frequency; }
    public int getInterval() { return interval; }
    public List<DayOfWeek> getByDays() { return byDays; }
    public ReservationStatus getStatus() { return status; }
    public List<ReservationResponse> getReservations() { return reservations; }
}
