package com.to.backend.repository;

import com.to.backend.model.ReservationProposal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Repozytorium do encji ReservationProposal.
 */
public interface ReservationProposalRepository extends MongoRepository<ReservationProposal, String> {

    // Znajdź wszystkie propozycje PENDING przeznaczone dla danego studenta
    List<ReservationProposal> findByStudentIdAndStatus(String studentId, com.to.backend.model.utils.ProposalStatus status);

    // (opcjonalnie) znajdź historię wszystkich propozycji dla danego oryginału
    List<ReservationProposal> findByOriginalReservationId(String originalReservationId);
}
