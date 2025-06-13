import showToast from "../hooks/show-toast";
import type { ReservationResponseDTO } from "../types/reservations";
import type { Room } from "../types/room";

export function showReservationToast(
  singleReservation: ReservationResponseDTO,
  room: Room,
  mode: "create" | "edit"
) {
  const startDate = new Date(singleReservation.start);
  const endDate = new Date(singleReservation.end);
  showToast(mode === "create" ? "Booking succeeded" : "Reservation updated", {
    description: `Room ${room.name} (${room.location}) ${
      mode === "create" ? "booked" : "updated"
    } for ${startDate.toTimeString().slice(0, 5)}-${endDate
      .toTimeString()
      .slice(0, 5)} ${startDate.toISOString().split("T")[0]}`,
    variant: "success",
  });
}
