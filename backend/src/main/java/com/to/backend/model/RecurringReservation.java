package com.to.backend.model;

import com.to.backend.model.utils.Frequency;
import com.to.backend.model.utils.ReservationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "recurring_reservations")
public class RecurringReservation {
    @Id
    private String id;

    private String userId;
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

    protected RecurringReservation(Builder builder) {
        this.id = builder.id;
        this.userId = builder.userId;
        this.roomId = builder.roomId;
        this.startDate = builder.startDate;
        this.endDate = builder.endDate;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.purpose = builder.purpose;
        this.minCapacity = builder.minCapacity;
        this.softwareIds = builder.softwareIds;
        this.equipmentIds = builder.equipmentIds;
        this.frequency = builder.frequency;
        this.interval = builder.interval;
        this.byDays = builder.byDays;
        this.status = builder.status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
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

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder roomId(String roomId) {
            this.roomId = roomId;
            return this;
        }

        public Builder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public Builder endDate(LocalDate endDate) {
            this.endDate = endDate;
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

        public Builder frequency(Frequency frequency) {
            this.frequency = frequency;
            return this;
        }

        public Builder interval(int interval) {
            this.interval = interval;
            return this;
        }

        public Builder byDays(List<DayOfWeek> byDays) {
            this.byDays = byDays;
            return this;
        }

        public Builder status(ReservationStatus status) {
            this.status = status;
            return this;
        }

        public RecurringReservation build() {
            return new RecurringReservation(this);
        }
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getRoomId() {
        return roomId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public int getMinCapacity() {
        return minCapacity;
    }

    public List<String> getSoftwareIds() {
        return softwareIds;
    }

    public List<String> getEquipmentIds() {
        return equipmentIds;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public int getInterval() {
        return interval;
    }

    public List<DayOfWeek> getByDays() {
        return byDays;
    }

    public ReservationStatus getStatus() {
        return status;
    }
}
