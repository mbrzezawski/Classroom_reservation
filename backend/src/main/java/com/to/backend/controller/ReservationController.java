package com.to.backend.controller;

import com.to.backend.model.Reservation;
import com.to.backend.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // POST /reservations - creates new reservation, returns 201 + Location
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation saved = service.createReservation(reservation);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    // GET /reservations - retrieves all reservations
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(service.getAllReservations());
    }

    // GET /reservations/{id} – retrieves reservation by id or returns 404
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        Reservation reservation = service.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    // DELETE /reservations/{id} – deletes reservation by id, returns 204 or 404
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservation(@PathVariable String id) {
        service.deleteReservation(id);
    }
}