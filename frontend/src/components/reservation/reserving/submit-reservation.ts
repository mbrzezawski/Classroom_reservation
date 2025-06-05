import { API_URL } from "../../../api";
import type {
  RecurringReservationRequestDTO,
  ReservationFormValues,
  ReservationRequestDTO,
} from "../../../types/reservations";
import buildStartEndDate from "../../../utils/build-start-end-date";

async function submitReservation(
  data: ReservationFormValues,
  userId: string,
  mode: "create" | "edit",
  reservationId?: string
) {
  const [startTime, endTime] = buildStartEndDate(data.startHour)
  const isRecurring = data.type === "recurring";
  const endpoint =
    mode === "edit"
      ? `${API_URL}/reservations/${reservationId}`
      : isRecurring
      ? `${API_URL}/recurring-reservations`
      : `${API_URL}/reservations/book`;

  const method = mode === "edit" ? "PUT" : "POST";
  let body: ReservationRequestDTO | RecurringReservationRequestDTO;
  if (isRecurring) {
    body = {
      userId,
      startDate: data.startDate!,
      endDate: data.endDate!,
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      purpose: data.title,
      minCapacity: data.atendees,
      softwareIds: data.software,
      equipmentIds: data.equipment,
      frequency: data.frequency!,
      interval: data.interval!,
      byDays: data.byDays ?? [],
      byMonthDays: (data.byMonthDays ?? []).map(Number),
      ...(data.roomId ? { roomId: data.roomId } : {}),
    };
  } else {
    body = {
      userId,
      date: data.date!,
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      purpose: data.title,
      minCapacity: data.atendees,
      softwareIds: data.software,
      equipmentIds: data.equipment,
      ...(data.roomId ? { roomId: data.roomId } : {}),
    };
  }
  console.log("request: ", body)
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
}

export default submitReservation;
