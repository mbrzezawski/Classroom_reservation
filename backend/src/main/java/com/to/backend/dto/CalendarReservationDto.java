package com.to.backend.dto;

import com.to.backend.model.ReservationProposal;
import com.to.backend.model.utils.ReservationStatus;
import lombok.Builder;
import lombok.Value;

import java.time.ZonedDateTime;
import java.util.List;

@Value
@Builder
public class CalendarReservationDto {
    String reservationId;
    String recurrenceId;
    ReservationStatus reservationStatus;
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
