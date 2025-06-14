package com.to.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalRequestDto {

    private String studentEmail;
    private String originalReservationId;
    private String originalRecurrenceId;

    // Tryb 1: pojedyncze zapytania
    private List<ReservationRequest> reservationRequests;

    // Tryb 2: cykliczne wzorce
    private List<RecurringReservationRequest> recurringRequests;

    // Opcjonalny komentarz
    private String comment;

    @AssertTrue(message = "Musisz podać albo reservationRequests (1–3), albo recurringRequests (1–3)")
    public boolean isOneModeOnly() {
        boolean single = reservationRequests != null && !reservationRequests.isEmpty();
        boolean recur  = recurringRequests  != null && !recurringRequests.isEmpty();
        return single ^ recur; // XOR – tylko jeden tryb może być aktywny
    }
}
