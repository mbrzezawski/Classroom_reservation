import { API_URL } from "../../../api";

const deleteReservation = async (
  reservationId: string,
  type: 'single' | 'recurring',
  token: string
) => {
  const endpoint =
    type === 'single'
      ? `${API_URL}/reservations/${reservationId}`
      : `${API_URL}/recurring-reservations/${reservationId}`;

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      const error = new Error('Nie można usunąć rezerwacji, ponieważ istnieje dla niej propozycja, która nie jest jeszcze potwierdzona.');
      (error as any).status = 409;
      throw error;
    }
    const error = new Error('Nie udało się usunąć rezerwacji.');
    (error as any).status = response.status;
    throw error;
  }
};

export default deleteReservation;
