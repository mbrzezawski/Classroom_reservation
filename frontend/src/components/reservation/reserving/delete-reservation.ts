import { API_URL } from "../../../api";

const deleteReservation = async (reservationId: string, type: 'single' | 'recurring', token: string) => {
  const endpoint = type === 'single' ? `${API_URL}/reservations/${reservationId}` : `${API_URL}/recurring-reservations/${reservationId}`
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Nie udało się usunąć rezerwacji");
  }
};

export default deleteReservation;
