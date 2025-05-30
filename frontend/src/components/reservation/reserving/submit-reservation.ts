import { API_URL } from "../../../api";
import type { ReservationFormValues, ReservationRequestDTO } from "../../../types/reservations";
import buildStartEndDate from "../../../utils/build-start-end-date";

async function submitReservation  (
  data: ReservationFormValues,
  userId: string,
  mode: 'create' | 'edit',
  reservationId?: string
)  {
    const [startTime, endTime] = buildStartEndDate(data.date, data.startHour)

    const endpoint =
      mode === "edit"
        ? `${API_URL}/reservations/${reservationId}`
        : `${API_URL}/reservations/book`;
    const method = mode === "edit" ? "PUT" : "POST";

  const body: ReservationRequestDTO = {
    userId: userId,
    date: data.date,
    startTime: startTime.toTimeString().slice(0,5),
    endTime: endTime.toTimeString().slice(0,5),
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