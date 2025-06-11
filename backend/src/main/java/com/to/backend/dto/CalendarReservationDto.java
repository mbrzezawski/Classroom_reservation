package com.to.backend.dto;

import lombok.Builder;
import lombok.Value;

import java.time.ZonedDateTime;
import java.util.List;

@Value
@Builder
public class CalendarReservationDto {
    String reservationId;
    String recurrenceId;
    String roomId;
    String roomName;
    String roomLocation;
    String title;
    ZonedDateTime start;
    ZonedDateTime end;
    int minCapacity;
    List<String> softwareIds;
    List<String> equipmentIds;
}
