package com.to.backend.controller;

import com.to.backend.dto.ConfirmProposalDto;
import com.to.backend.dto.ProposalRequestDto;
import com.to.backend.dto.ProposalResponseDto;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.model.ReservationProposal;
import com.to.backend.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/proposals")
@PreAuthorize("isAuthenticated()")
public class ReservationProposalController {

    private final ReservationService reservationService;

    public ReservationProposalController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * 1. Tworzenie propozycji: /proposals
     *    - tylko TEACHER
     *    - w body: ProposalRequestDto (z List<SlotWithDateDto>)
     *    Zwracamy utworzoną encję ReservationProposal (możemy też zwrócić DTO).
     */
    @PostMapping
    public ResponseEntity<ReservationProposal> createProposal(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProposalRequestDto dto) {

        ReservationProposal saved = reservationService.createProposal(dto, userDetails.getUsername());
        return ResponseEntity.ok(saved);
    }

    /**
     * 2. Pobranie wszystkich pending‐proposals dla zalogowanego studenta
     *    - tylko STUDENT
     *    - zwracamy listę ProposalResponseDto
     */
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ProposalResponseDto>> listProposalsForStudent(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ProposalResponseDto> list = reservationService.listProposalsForStudent(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    /**
     * 3. Potwierdzenie wyboru slotu przez studenta: /proposals/{proposalId}/confirm
     *    - tylko STUDENT
     *    - w body: ConfirmProposalDto { chosenIndex: 0..size-1 }
     *    - zwracamy ReservationResponse (pełną rezerwację po zatwierdzeniu/utworzeniu)
     */
    @PostMapping("/{proposalId}/confirm")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ReservationResponse> confirmProposal(
            @PathVariable String proposalId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConfirmProposalDto confirmDto) {

        ReservationResponse resp = reservationService.confirmProposal(
                proposalId,
                confirmDto,
                userDetails.getUsername()
        );
        return ResponseEntity.ok(resp);
    }

    /**
     * 4. Student odrzuca całą propozycję: /proposals/{proposalId}/reject
     *    - tylko STUDENT
     */
    @PostMapping("/{proposalId}/reject")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> rejectProposal(
            @PathVariable String proposalId,
            @AuthenticationPrincipal UserDetails userDetails) {

        reservationService.rejectProposal(proposalId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
