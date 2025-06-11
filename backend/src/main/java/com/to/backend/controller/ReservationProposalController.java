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

    // POST /proposals – creates new proposal from teacher to students
    // FOR: TEACHER, ADMIN
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ReservationProposal> createProposal(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProposalRequestDto dto
    ) {
        ReservationProposal saved = reservationService.createProposal(dto, userDetails.getUsername());
        return ResponseEntity.ok(saved);
    }

    // GET /proposals/student – retrieves pending proposals for current student
    // FOR: STUDENT, ADMIN
    @GetMapping("/student")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<ProposalResponseDto>> listProposalsForStudent(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ProposalResponseDto> list = reservationService.listProposalsForStudent(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    // POST /proposals/{proposalId}/confirm – confirms selected slot from proposal
    // FOR: STUDENT, ADMIN
    @PostMapping("/{proposalId}/confirm")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ReservationResponse> confirmProposal(
            @PathVariable String proposalId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConfirmProposalDto confirmDto
    ) {
        ReservationResponse resp = reservationService.confirmProposal(
                proposalId,
                confirmDto,
                userDetails.getUsername()
        );
        return ResponseEntity.ok(resp);
    }

    // POST /proposals/{proposalId}/reject – rejects the entire proposal
    // FOR: STUDENT, ADMIN
    @PostMapping("/{proposalId}/reject")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Void> rejectProposal(
            @PathVariable String proposalId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        reservationService.rejectProposal(proposalId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}


