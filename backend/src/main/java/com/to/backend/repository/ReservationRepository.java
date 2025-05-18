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

    // retrieves user's reservations sorted in ascending order in regard to time
    List<Reservation> findByUserIdOrderByDateAscStartTimeAsc(String userId);

    // retrieves user's reservations sorted in ascending order in regard to time
    // between "from" and "to"
    List<Reservation> findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(
            String userId,
            LocalDate from,
            LocalDate to
    );

    void deleteReservationsByRecurringReservationId(
            String recurringReservationId
    );
}
