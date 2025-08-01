package com.to.backend.repository;

import com.to.backend.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.DayOfWeek;
import java.time.ZonedDateTime;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {

    // find overlapping reservations
    List<Reservation> findByRoomIdAndStartLessThanAndEndGreaterThan(
            String roomId,
            ZonedDateTime end,
            ZonedDateTime start
    );

    // retrieves user's reservations sorted in ascending order in regard to time
    List<Reservation> findByUserIdOrderByStartAscStartAsc(String userId);

    // retrieves user's reservations sorted in ascending order in regard to time
    // between "from" and "to"
    List<Reservation> findByUserIdAndStartBetweenOrderByStartAsc(
            String userId,
            ZonedDateTime from,
            ZonedDateTime to
    );

    void deleteByRecurrenceId(
            String recurrenceId
    );

    List<Reservation> findByUserIdOrderByStartAsc(String userId);

    List<Reservation> findByRecurrenceId(String recurrenceId);

    boolean existsByRecurrenceId(String recurrenceId);
}
