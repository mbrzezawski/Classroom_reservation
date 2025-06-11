package com.to.backend.controller;

import com.to.backend.dto.RecurringReservationRequest;
import com.to.backend.dto.RecurringReservationResponse;
import com.to.backend.model.RecurringReservation;
import com.to.backend.service.RecurringReservationService;
import com.to.backend.service.helper.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recurring-reservations")
@PreAuthorize("isAuthenticated()")
public class RecurringReservationController {

    private final RecurringReservationService service;

    public RecurringReservationController(RecurringReservationService service) {
        this.service = service;
    }

    // POST /recurring-reservations – creates a recurring reservation pattern and instances
    // FOR: EVERYONE LOGGED IN
    @PostMapping
    public ResponseEntity<RecurringReservationResponse> create(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody RecurringReservationRequest dto
    ) {
        dto.setUserId(principal.getUser().getId());
        RecurringReservationResponse result = service.createRecurringReservations(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // GET /recurring-reservations – lists all recurring reservations of current user
    // FOR: EVERYONE LOGGED IN
    @GetMapping
    public ResponseEntity<List<RecurringReservation>> list(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        List<RecurringReservation> list =
                service.getRecurringReservationsForUser(principal.getUser().getId());
        return ResponseEntity.ok(list);
    }

    // GET /recurring-reservations/{id} – retrieves recurring reservation pattern by ID
    // FOR: EVERYONE LOGGED IN
    @GetMapping("/{id}")
    public ResponseEntity<RecurringReservation> getById(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        RecurringReservation recurringReservation = service.getRecurringReservation(id);
        return ResponseEntity.ok(recurringReservation);
    }

    // PUT /recurring-reservations/{id} – updates a recurring reservation pattern
    // FOR: OWNER OF PATTERN
    @PutMapping("/{id}")
    public ResponseEntity<RecurringReservationResponse> update(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody RecurringReservationRequest dto
    ) {
        dto.setUserId(principal.getUser().getId());
        RecurringReservationResponse updated = service.updatePattern(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE /recurring-reservations/{id} – deletes pattern and all related reservations
    // FOR: OWNER OF PATTERN
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        service.deletePattern(id);
    }
}

