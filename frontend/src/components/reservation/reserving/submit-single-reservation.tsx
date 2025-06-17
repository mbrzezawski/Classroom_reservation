import { API_URL } from "../../../api";
import type {
  ReservationRequestDTO,
  SingleReservationFormValues,
} from "../../../types/reservations";

async function submitSingleReservation(
  data: SingleReservationFormValues,
  userId: string,
  token: string,
  mode: "create" | "edit",
  reservationId?: string
) {
  const method = mode === "edit" ? "PUT" : "POST";
  const endpoint =
    mode === "edit"
      ? `${API_URL}/reservations/${reservationId}`
      : `${API_URL}/reservations/book`;

  let body: ReservationRequestDTO;
  body = {
    userId: userId,
    date: data.date,
    startTime: data.startHour,
    endTime: data.endHour,
    purpose: data.title,
    minCapacity: data.atendees,
    softwareIds: data.software,
    equipmentIds: data.equipment,
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

export default submitSingleReservation;
