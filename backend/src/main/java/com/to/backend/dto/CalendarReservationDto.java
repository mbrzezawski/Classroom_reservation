package com.to.backend.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class CalendarReservationDto {

    private final String reservationId;
    private final String recurrenceId;    // <- nowe pole
    private final String roomId;
    private final String roomName;
    private final String roomLocation;
    private final String title;
    private final ZonedDateTime start;
    private final ZonedDateTime end;
    private final int minCapacity;
    private final List<String> softwareIds;
    private final List<String> equipmentIds;

    private CalendarReservationDto(Builder b) {
        this.reservationId  = b.reservationId;
        this.recurrenceId   = b.recurrenceId;
        this.roomId         = b.roomId;
        this.roomName       = b.roomName;
        this.roomLocation   = b.roomLocation;
        this.title          = b.title;
        this.start          = b.start;
        this.end            = b.end;
        this.minCapacity    = b.minCapacity;
        this.softwareIds    = b.softwareIds;
        this.equipmentIds   = b.equipmentIds;
    }

    public String getReservationId() { return reservationId; }
    public String getRecurrenceId()  { return recurrenceId; }
    public String getRoomId()        { return roomId; }
    public String getRoomName()      { return roomName; }
    public String getRoomLocation()  { return roomLocation; }
    public String getTitle()         { return title; }
    public ZonedDateTime getStart()  { return start; }
    public ZonedDateTime getEnd()    { return end; }
    public int getMinCapacity()      { return minCapacity; }
    public List<String> getSoftwareIds()   { return softwareIds; }
    public List<String> getEquipmentIds()  { return equipmentIds; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String reservationId;
        private String recurrenceId;
        private String roomId;
        private String roomName;
        private String roomLocation;
        private String title;
        private ZonedDateTime start;
        private ZonedDateTime end;
        private int minCapacity;
        private List<String> softwareIds;
        private List<String> equipmentIds;

        public Builder reservationId(String id)   { this.reservationId = id; return this; }
        public Builder recurrenceId(String id)    { this.recurrenceId = id; return this; }
        public Builder roomId(String id)          { this.roomId = id; return this; }
        public Builder roomName(String n)         { this.roomName = n; return this; }
        public Builder roomLocation(String l)     { this.roomLocation = l; return this; }
        public Builder title(String t)            { this.title = t; return this; }
        public Builder start(ZonedDateTime s)     { this.start = s; return this; }
        public Builder end(ZonedDateTime e)       { this.end = e; return this; }
        public Builder minCapacity(int c)         { this.minCapacity = c; return this; }
        public Builder softwareIds(List<String> s){ this.softwareIds = s; return this; }
        public Builder equipmentIds(List<String> e){ this.equipmentIds = e; return this; }

        public CalendarReservationDto build()    { return new CalendarReservationDto(this); }
    }
}
