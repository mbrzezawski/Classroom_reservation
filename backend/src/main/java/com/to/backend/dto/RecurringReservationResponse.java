package com.to.backend.dto;

import com.to.backend.model.utils.Frequency;
import com.to.backend.model.utils.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO representing a recurring reservation with associated instance reservations.
 */
@Data
@Builder
public class RecurringReservationResponse {
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
}
