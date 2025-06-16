package com.to.backend.model;

import com.to.backend.dto.RecurringReservationRequest;
import com.to.backend.dto.ReservationRequest;
import com.to.backend.model.utils.ProposalStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "reservationProposals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationProposal {

    @Id
    private String id;

    private String teacherId;
    private String studentId;

    private String originalReservationId;
    private String originalRecurrenceId;

    private List<ReservationRequest> reservationRequests;
    private List<RecurringReservationRequest> recurringRequests;

    @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;

    private String comment;

    private List<String> generatedReservationIds;
}
