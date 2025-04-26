package com.to.backend.repository;

import com.to.backend.model.RecurringReservation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecurringReservationRepository extends MongoRepository<RecurringReservation, String> {
}
