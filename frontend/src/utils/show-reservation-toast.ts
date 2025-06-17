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
  showToast(mode === "create" ? "Zarezerwowano" : "Rezerwacja zaktualizowana", {
    description: `Sala ${room.name} (${room.location}) ${
      mode === "create" ? "zarezerwowana" : "zaktualizowano"
    } na ${startDate.toTimeString().slice(0, 5)}-${endDate
      .toTimeString()
      .slice(0, 5)} ${startDate.toISOString().split("T")[0]}`,
    variant: "success",
  });
}
