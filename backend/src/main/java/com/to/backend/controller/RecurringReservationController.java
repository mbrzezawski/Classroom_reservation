package com.to.backend.controller;

import com.to.backend.dto.RecurringReservationRequestDto;
import com.to.backend.dto.RecurringReservationResponseDto;
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

//    /**
//     * Create a new recurring reservation pattern and associated reservations.
//     */
//    @PostMapping
//    public ResponseEntity<RecurringReservationResponseDto> create(
//            @AuthenticationPrincipal CustomUserDetails principal,
//            @Valid @RequestBody RecurringReservationRequestDto dto
//    ) {
//        // ensure userId comes from authenticated principal
//        dto.setUserId(principal.getUser().getId());
//        RecurringReservationResponseDto result = service.createRecurringReservations(dto);
//        return ResponseEntity.status(HttpStatus.CREATED).body(result);
//    }

    // WERSJA BEZ PRINCIPAL DO TESTÓW
    @PostMapping
    public ResponseEntity<RecurringReservationResponseDto> create(
            @Valid @RequestBody RecurringReservationRequestDto dto
    ) {
        // teraz wymagamy, żeby DTO miało ustawione userId
        if (dto.getUserId() == null || dto.getUserId().isBlank()) {
            // możesz tu rzucić BadRequest albo domyślnie pobrać konta testowego
            throw new IllegalArgumentException("Pole userId jest wymagane");
        }
        RecurringReservationResponseDto result = service.createRecurringReservations(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    /**
     * Get all recurring reservation patterns for the current user.
     */
    @GetMapping
    public ResponseEntity<List<RecurringReservation>> list(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        List<RecurringReservation> list =
                service.getRecurringReservationsForUser(principal.getUser().getId());
        return ResponseEntity.ok(list);
    }

    /**
     * Get a specific recurring reservation pattern by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecurringReservation> getById(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        RecurringReservation recurringReservation = service.getRecurringReservation(id);
        return ResponseEntity.ok(recurringReservation);
    }

    /**
     * Update an existing recurring reservation pattern.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RecurringReservationResponseDto> update(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody RecurringReservationRequestDto dto
    ) {
        dto.setUserId(principal.getUser().getId());
        RecurringReservationResponseDto updated = service.updatePattern(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a recurring reservation pattern and all associated reservations.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        service.deletePattern(id);
    }
}
