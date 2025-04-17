package com.to.backend.service;

import com.to.backend.model.Reservation;
import com.to.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository repo;
    public ReservationService(ReservationRepository repo) { this.repo = repo; }

    public Reservation create(Reservation reservation) { return repo.save(reservation); }

    public List<Reservation> findAll() { return repo.findAll(); }

    public Optional<Reservation> findById(String id) { return repo.findById(id); }

    public void delete(String id) { repo.deleteById(id); }
}
