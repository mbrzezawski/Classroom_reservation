package com.to.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kiedy student potwierdza jedną z trzech opcji, wysyła:
 * - chosenIndex: 0, 1 lub 2 (wskaźnik w liście slotów)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmProposalDto {
    private Integer chosenIndex;
}
