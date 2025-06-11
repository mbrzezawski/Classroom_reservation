package com.to.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.to.backend.model.utils.ReservationStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.ZonedDateTime;
import java.util.List;

@Document(collection = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    private String id;

    private String userId;
    private String roomId;
    private String recurrenceId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private ZonedDateTime start;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private ZonedDateTime end;

    private String purpose;
    private int minCapacity;
    private List<String> softwareIds;
    private List<String> equipmentIds;
    private ReservationStatus status;
}
