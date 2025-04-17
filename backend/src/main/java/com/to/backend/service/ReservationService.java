package com.to.backend.service;

import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Reservation;
import com.to.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository repo;
    public ReservationService(ReservationRepository repo) { this.repo = repo; }

    public Reservation createReservation(Reservation reservation) {
        return repo.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return repo.findAll();
    }

    public Reservation getReservationById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation", id));
    }

    public void deleteReservation(String id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Reservation", id);
        }
        repo.deleteById(id);
    }
}
