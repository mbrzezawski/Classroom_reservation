package com.to.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

public class CalendarReservationDto {

    private final String reservationId;
    private final String roomId;
    private final String roomName;
    private final String roomLocation;
    private final String title;
    private final LocalDateTime start;
    private final LocalDateTime end;
    private final int minCapacity;
    private final List<String> softwareIds;
    private final List<String> equipmentIds;

    private CalendarReservationDto(Builder builder) {
        this.reservationId = builder.reservationId;
        this.roomId        = builder.roomId;
        this.roomName      = builder.roomName;
        this.roomLocation  = builder.roomLocation;
        this.title         = builder.title;
        this.start         = builder.start;
        this.end           = builder.end;
        this.minCapacity   = builder.minCapacity;
        this.softwareIds   = builder.softwareIds;
        this.equipmentIds  = builder.equipmentIds;
    }

    public String getReservationId() {
        return reservationId;
    }

    public String getRoomId() {
        return roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getRoomLocation() {
        return roomLocation;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public LocalDateTime getEnd() {
        return end;
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


    /** building new instance of  CalendarReservationDto*/
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String reservationId;
        private String roomId;
        private String roomName;
        private String roomLocation;
        private String title;
        private LocalDateTime start;
        private LocalDateTime end;
        private int minCapacity;
        private List<String> softwareIds;
        private List<String> equipmentIds;

        private Builder() {
        }

        public Builder reservationId(String reservationId) {
            this.reservationId = reservationId;
            return this;
        }

        public Builder roomId(String roomId) {
            this.roomId = roomId;
            return this;
        }

        public Builder roomName(String roomName) {
            this.roomName = roomName;
            return this;
        }

        public Builder roomLocation(String roomLocation) {
            this.roomLocation = roomLocation;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder start(LocalDateTime start) {
            this.start = start;
            return this;
        }

        public Builder end(LocalDateTime end) {
            this.end = end;
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

        /** Kończy budowanie i zwraca nową instancję DTO. */
        public CalendarReservationDto build() {
            return new CalendarReservationDto(this);
        }
    }
}
