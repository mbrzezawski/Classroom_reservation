package com.to.backend.dto;

import com.to.backend.model.utils.ReservationStatus;
import java.time.ZonedDateTime;
import java.util.List;

public record ReservationResponse(
        String reservationId,
        String userId,
        String roomId,
        String recurringReservationId,
        ZonedDateTime start,
        ZonedDateTime end,
        String purpose,
        int minCapacity,
        List<String> softwareIds,
        List<String> equipmentIds,
        ReservationStatus status
) { }
