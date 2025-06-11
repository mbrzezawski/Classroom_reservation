package com.to.backend.controller;

import com.to.backend.dto.CalendarReservationDto;
import com.to.backend.dto.RecurringReservationRequest;
import com.to.backend.dto.ReservationRequest;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Reservation;
import com.to.backend.service.ReservationService;
import com.to.backend.service.helper.CustomUserDetails;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // POST /reservations – creates new reservation (manual, only for admin)
    // FOR: ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation saved = service.createReservation(reservation);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    // GET /reservations – retrieves all reservations
    // FOR: EVERYONE LOGGED IN
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(service.getAllReservations());
    }

    // GET /reservations/{id} – retrieves reservation by id
    // FOR: EVERYONE LOGGED IN
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        Reservation reservation = service.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    // DELETE /reservations/{id} – deletes reservation by id
    // FOR: ADMIN, TEACHER, OWNER
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(
            "hasRole('ADMIN') || hasRole('TEACHER') || @reservationService.isOwner(#id, principal.username)"
    )
    public void deleteReservation(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        service.deleteReservation(id);
    }

    // POST /reservations/book – creates new reservation from frontend request
    // FOR: EVERYONE LOGGED IN
    @PostMapping("/book")
    public ResponseEntity<ReservationResponse> reserve(@RequestBody ReservationRequest req) {
        ReservationResponse resp = service.reserve(req);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(resp.reservationId())
                .toUri();

        return ResponseEntity.created(location).body(resp);
    }

    // GET /reservations/calendar – retrieves reservations of user in calendar format
    // FOR: EVERYONE LOGGED IN
    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarReservationDto>> getCalendar(
            @RequestParam("userId") String userId,
            @RequestParam(name = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<CalendarReservationDto> events = service.getUserCalendar(userId, Optional.ofNullable(from), Optional.ofNullable(to));
        return ResponseEntity.ok(events);
    }

    // DELETE /reservations/{id}/cancel – cancels reservation by owner or admin
    // FOR: ADMIN, OWNER
    @DeleteMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize(
            "hasRole('ADMIN') || @reservationService.isOwner(#reservationId, principal.username)"
    )
    public void cancelReservation(
            @PathVariable("id") String reservationId,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        String userId = principal.getUser().getId();
        service.cancelReservation(reservationId, userId);
    }

    // PUT /reservations/{id} – updates existing reservation
    // FOR: ADMIN, TEACHER, OWNER
    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') || hasRole('TEACHER') || @reservationService.isOwner(#oldReservationId, principal.username)"
    )
    public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable("id") String oldReservationId,
            @Valid @RequestBody ReservationRequest updatedRequest
    ) {
        ReservationResponse newResp = service.updateReservation(oldReservationId, updatedRequest);
        return ResponseEntity.ok(newResp);
    }
}
