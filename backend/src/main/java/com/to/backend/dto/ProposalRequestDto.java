package com.to.backend.dto;

import java.util.List;

/**
 * DTO wysyłane przez nauczyciela w momencie tworzenia propozycji.
 * - studentEmail: mail studenta, który będzie musiał potwierdzić
 * - originalReservationId: jeśli to edycja istniejącej rezerwacji (lub null jeśli nowa)
 * - proposedSlots: maksymalnie 3 obiekty { date, startTime, endTime }
 * - comment: opcjonalny komentarz od nauczyciela
 *
 * Każdy SlotWithDateDto zawiera już swoją datę – więc różne dni i różne godziny
 * mogą być teraz podane niezależnie.
 */
public class ProposalRequestDto {

    private String studentEmail;
    private String originalReservationId;
    private String originalRecurrenceId;

    // Teraz zamiast jednej wspólnej daty, każdy “slot” ma swoją datę i godziny.
    private List<SlotWithDateDto> proposedSlots;

    // Opcjonalny komentarz od nauczyciela
    private String comment;

    public ProposalRequestDto() { }

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

    public List<SlotWithDateDto> getProposedSlots() {
        return proposedSlots;
    }

    public void setProposedSlots(List<SlotWithDateDto> proposedSlots) {
        this.proposedSlots = proposedSlots;
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
