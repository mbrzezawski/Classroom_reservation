package com.to.backend.repository;

import com.to.backend.model.RecurringReservation;
import com.to.backend.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Arrays;
import java.util.List;

public interface RecurringReservationRepository extends MongoRepository<RecurringReservation, String> {
    List<RecurringReservation> findByUserId(String userId);

}
