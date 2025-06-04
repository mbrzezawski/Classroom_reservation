package com.to.backend.dto;

/**
 * Kiedy student potwierdza jedną z trzech opcji, wysyła:
 * - chosenIndex: 0, 1 lub 2 (wskaźnik w liście slotów)
 */
public class ConfirmProposalDto {
    private Integer chosenIndex;

    public ConfirmProposalDto() { }

    public ConfirmProposalDto(Integer chosenIndex) {
        this.chosenIndex = chosenIndex;
    }

    public Integer getChosenIndex() {
        return chosenIndex;
    }

    public void setChosenIndex(Integer chosenIndex) {
        this.chosenIndex = chosenIndex;
    }
}
