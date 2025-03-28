package com.to.backend.controller;

import com.to.backend.model.Reservation;
import com.to.backend.repository.ReservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationRepository repo;

    public ReservationController(ReservationRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/create")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(repo.save(reservation));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(repo.findAll());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok("Rezerwacja usunięta");
    }
}
