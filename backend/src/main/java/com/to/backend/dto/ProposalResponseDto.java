package com.to.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.to.backend.model.utils.ProposalStatus;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * DTO zwracane przy odpytywaniu o istniejącą propozycję:
 * - id (proposalId),
 * - teacherId (lub teacherEmail),
 * - studentId (lub studentEmail),
 * - originalReservationId (lub null),
 * - lista slotów (start/end w ZonedDateTime, by klient wiedział strefę),
 * - status (PENDING / CONFIRMED / REJECTED),
 * - chosenIndex (jeśli CONFIRMED),
 * - opcjonalny comment.
 */
public class ProposalResponseDto {

    private String proposalId;
    private String teacherId;
    private String teacherEmail;
    private String studentId;
    private String studentEmail;
    private String originalReservationId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private List<ZonedDateTime> proposalsStart;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private List<ZonedDateTime> proposalsEnd;

    private ProposalStatus status;
    private Integer chosenIndex;
    private String comment;

    public ProposalResponseDto() { }

    // konstruktor wygodny do mapowania
    public ProposalResponseDto(
            String proposalId,
            String teacherId,
            String teacherEmail,
            String studentId,
            String studentEmail,
            String originalReservationId,
            List<ZonedDateTime> proposalsStart,
            List<ZonedDateTime> proposalsEnd,
            ProposalStatus status,
            Integer chosenIndex,
            String comment
    ) {
        this.proposalId = proposalId;
        this.teacherId = teacherId;
        this.teacherEmail = teacherEmail;
        this.studentId = studentId;
        this.studentEmail = studentEmail;
        this.originalReservationId = originalReservationId;
        this.proposalsStart = proposalsStart;
        this.proposalsEnd = proposalsEnd;
        this.status = status;
        this.chosenIndex = chosenIndex;
        this.comment = comment;
    }

    // gettery/settery ...

    public String getProposalId() {
        return proposalId;
    }

    public void setProposalId(String proposalId) {
        this.proposalId = proposalId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherEmail() {
        return teacherEmail;
    }

    public void setTeacherEmail(String teacherEmail) {
        this.teacherEmail = teacherEmail;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public Integer getChosenIndex() {
        return chosenIndex;
    }

    public void setChosenIndex(Integer chosenIndex) {
        this.chosenIndex = chosenIndex;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
