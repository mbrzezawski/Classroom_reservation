package com.to.backend.model.utils;

/**
 * Status propozycji nowych terminów:
 * - PENDING: oczekuje akcji studenta
 * - CONFIRMED: student wybrał jeden slot
 * - REJECTED: student odrzucił wszystkie lub nauczyciel anulował
 */
public enum ProposalStatus {
    PENDING,
    CONFIRMED,
    REJECTED
}
