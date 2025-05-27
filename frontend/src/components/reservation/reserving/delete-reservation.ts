import { API_URL } from "../../../api";

const deleteReservation = async (reservationId: string) => {
  const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete reservation");
  }
};

export default deleteReservation;
