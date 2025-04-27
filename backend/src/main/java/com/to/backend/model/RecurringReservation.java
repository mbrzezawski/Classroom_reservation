package com.to.backend.model;

import com.to.backend.model.utils.Frequency;
import com.to.backend.model.utils.ReservationStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data                              // getter, setter, equals, hashCode, toString
@Builder(toBuilder = true)         // builder + toBuilder()
@NoArgsConstructor                 // konstruktor bezargumentowy
@AllArgsConstructor                // konstruktor ze wszystkimi polami
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
}
