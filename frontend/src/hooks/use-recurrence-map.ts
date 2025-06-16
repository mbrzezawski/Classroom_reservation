import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useAuth } from "../auth/auth-context";
import type { RecurringReservationResponseDTO } from "../types/reservations";

export function useRecurrenceMap() {
  const [recurrenceMap, setRecurrenceMap] = useState<Record<string, RecurringReservationResponseDTO>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    fetch(`${API_URL}/recurring-reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((recurringData: RecurringReservationResponseDTO[]) => {
        setRecurrenceMap(Object.fromEntries(recurringData.map((r) => [r.recurringReservationId, r])));
      })
      .catch((err) => {
        console.error("Error while loading recurring reservations", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  return { recurrenceMap, isLoading };
}
