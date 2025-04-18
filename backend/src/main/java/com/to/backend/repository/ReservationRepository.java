package com.to.backend.repository;

import com.to.backend.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {

    // find overlapping reservations
    List<Reservation> findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            String roomId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime
    );
}
