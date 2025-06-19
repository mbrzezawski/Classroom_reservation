import { useEffect, useState, useCallback } from "react";
import { API_URL } from "../api";
import { useAuth } from "../auth/auth-context";
import type { RecurringReservationResponseDTO } from "../types/reservations";

export function useRecurrenceMap() {
  const [recurrenceMap, setRecurrenceMap] = useState<Record<string, RecurringReservationResponseDTO>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const fetchRecurrenceMap = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/recurring-reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recurringData: RecurringReservationResponseDTO[] = await res.json();
      setRecurrenceMap(
        Object.fromEntries(recurringData.map((r) => [r.recurringReservationId, r]))
      );
    } catch (err) {
      console.error("Error while loading recurring reservations", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecurrenceMap();
  }, [fetchRecurrenceMap]);

  return {
    recurrenceMap,
    isLoading,
    refetchRecurrenceMap: fetchRecurrenceMap, // tu masz swojego świętego grala
  };
}