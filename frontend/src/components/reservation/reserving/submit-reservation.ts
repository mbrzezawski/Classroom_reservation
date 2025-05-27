import { API_URL } from "../../../api";
import type { ReservationRequestDTO } from "../../../types/reservations";
import type { ReservationFormValues } from "../reservation-form";

async function submitReservation  (
  data: ReservationFormValues,
  userId: string,
  mode: 'create' | 'edit',
  reservationId?: string
)  {
  const [year, month, day] = data.date.split("-").map(Number);
  const startHour = data.startHour;
  const [hours, minutes] = startHour.split(":").map(Number);
  const startTime = new Date(year, month - 1, day, hours, minutes)
    .toTimeString()
    .slice(0, 5);
  const endTime = new Date(year, month - 1, day, hours, minutes + 90)
    .toTimeString()
    .slice(0, 5);

    const endpoint =
      mode === "edit"
        ? `${API_URL}/reservations/${reservationId}`
        : `${API_URL}/reservations/book`;
    const method = mode === "edit" ? "PUT" : "POST";

  const body: ReservationRequestDTO = {
    userId: userId,
    date: data.date,
    startTime: startTime,
    endTime: endTime,
    purpose: data.title,
    minCapacity: data.atendees,
    softwareIds: data.software,
    equipmentIds: data.equipment,
  };


  const res = await fetch(`${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to make reservation");
  }

  return await res.json();
};

export default submitReservation