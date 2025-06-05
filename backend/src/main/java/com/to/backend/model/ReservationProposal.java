package com.to.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.to.backend.model.utils.ProposalStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Encja opisująca propozycję zmiany (lub nowej) rezerwacji wysłaną przez TEACHER-a do STUDENTA.
 */
@Document(collection = "reservationProposals")
public class ReservationProposal {

    @Id
    private String id;

    // ID nauczyciela, który proponuje zmianę
    private String teacherId;

    // ID studenta, który ma zaakceptować termin
    private String studentId;

    // Jeśli to edycja istniejącej rezerwacji, to tutaj ID tej rezerwacji. Jeśli null → nowa rezerwacja.
    private String originalReservationId;
    private String originalRecurrenceId;

    /**
     * Każda para (proposalsStart[i], proposalsEnd[i]) to pełny ZonedDateTime:
     * data + godzina + strefa (np. Europe/Warsaw). Maksymalnie 3 elementy list.
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private List<ZonedDateTime> proposalsStart;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private List<ZonedDateTime> proposalsEnd;

    // Który indeks został wybrany przez studenta (0, 1 lub 2). Gdy nie wybrano → null.
    private Integer chosenIndex;

    // Status propozycji: PENDING / CONFIRMED / REJECTED
    private ProposalStatus status;

    // Opcjonalny komentarz od nauczyciela
    private String comment;

    public ReservationProposal() { }

    public ReservationProposal(
            String teacherId,
            String studentId,
            String originalReservationId,
            String originalRecurrenceId,
            List<ZonedDateTime> proposalsStart,
            List<ZonedDateTime> proposalsEnd,
            String comment
    ) {
        this.teacherId = teacherId;
        this.studentId = studentId;
        this.originalReservationId = originalReservationId;
        this.originalRecurrenceId = originalRecurrenceId;
        this.proposalsStart = proposalsStart;
        this.proposalsEnd = proposalsEnd;
        this.comment = comment;
        this.status = ProposalStatus.PENDING;
        this.chosenIndex = null;
    }

    // gettery / settery …

    public String getId() {
        return id;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getOriginalReservationId() {
        return originalReservationId;
    }

    public void setOriginalReservationId(String originalReservationId) {
        this.originalReservationId = originalReservationId;
    }

    public List<ZonedDateTime> getProposalsStart() {
        return proposalsStart;
    }

    public void setProposalsStart(List<ZonedDateTime> proposalsStart) {
        this.proposalsStart = proposalsStart;
    }

    public List<ZonedDateTime> getProposalsEnd() {
        return proposalsEnd;
    }

    public void setProposalsEnd(List<ZonedDateTime> proposalsEnd) {
        this.proposalsEnd = proposalsEnd;
    }

    public Integer getChosenIndex() {
        return chosenIndex;
    }

    public void setChosenIndex(Integer chosenIndex) {
        this.chosenIndex = chosenIndex;
    }

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getOriginalRecurrenceId() {
        return originalRecurrenceId;
    }

    public void setOriginalRecurrenceId(String originalRecurrenceId) {
        this.originalRecurrenceId = originalRecurrenceId;
    }
}
