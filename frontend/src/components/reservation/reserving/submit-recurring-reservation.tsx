import { API_URL } from "../../../api";
import type {
  RecurringReservationFormValues,
  RecurringReservationRequestDTO,
} from "../../../types/reservations";

async function submitRecurringReservation(
  data: RecurringReservationFormValues,
  userId: string,
  token: string,
  mode: "create" | "edit",
  reservationId?: string
) {
  const method = mode === "edit" ? "PUT" : "POST";
  const endpoint =
    mode === "edit"
      ? `${API_URL}/recurring-reservations/${reservationId}`
      : `${API_URL}/recurring-reservations`;

  let body: RecurringReservationRequestDTO;
  body = {
    userId: userId,
    startDate: data.startDate,
    endDate: data.endDate,
    startTime: data.startHour,
    endTime: data.endHour,
    purpose: data.title,
    minCapacity: data.atendees,
    softwareIds: data.software,
    equipmentIds: data.equipment,
    frequency: data.frequency,
    interval: data.interval,
    byMonthDays: data.byMonthDays,
    byDays: data.byDays,
  };

  const res = await fetch(`${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to make reservation");
  }

  return await res.json();
}

export default submitRecurringReservation;
