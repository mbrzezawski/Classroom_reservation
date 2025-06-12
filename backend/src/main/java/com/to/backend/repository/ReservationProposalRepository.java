package com.to.backend.repository;

import com.to.backend.model.ReservationProposal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repozytorium do encji ReservationProposal.
 */
public interface ReservationProposalRepository extends MongoRepository<ReservationProposal, String> {

    // Znajdź wszystkie propozycje PENDING przeznaczone dla danego studenta
    List<ReservationProposal> findByStudentIdAndStatus(String studentId, com.to.backend.model.utils.ProposalStatus status);

    List<ReservationProposal> findByStudentId(String studentId);

    // (opcjonalnie) znajdź historię wszystkich propozycji dla danego oryginału
    List<ReservationProposal> findByOriginalReservationId(String originalReservationId);

    Optional<Object> findByTeacherIdAndStudentIdAndOriginalReservationIdIsNull(String teacherId, String studentId);

    List<ReservationProposal> findByOriginalRecurrenceId(String originalRecurrenceId);
}
