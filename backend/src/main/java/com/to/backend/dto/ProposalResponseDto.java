package com.to.backend.dto;

import com.to.backend.model.utils.ProposalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProposalResponseDto {
    private String id;

    private String teacherId;
    private String teacherEmail;

    private String studentId;
    private String studentEmail;

    private String originalReservationId;
    private String originalRecurrenceId;

    private List<ReservationRequest> reservationRequests;
    private List<RecurringReservationRequest> recurringRequests;

    private ProposalStatus status;
    private String comment;
}
