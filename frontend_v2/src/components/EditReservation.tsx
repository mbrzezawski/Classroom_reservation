import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReservationForm from './ReservationForm';
import type { ReservationRequestDTO, ReservationResponseDTO } from '../types/types';

interface EditReservationProps {
  userId: string;
}

export const EditReservation: React.FC<EditReservationProps> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ReservationRequestDTO | null>(null);

  useEffect(() => {
    axios
      .get<ReservationResponseDTO>(`http://localhost:8080/reservations/${id}`)
      .then(res => {
        const resp = res.data;
        setInitialData({
          userId,                      // <- właściwy userId
          date: resp.date,
          startTime: resp.startTime,
          endTime: resp.endTime,
          purpose: resp.purpose,
          minCapacity: resp.minCapacity,
          softwareIds: resp.softwareIds,
          equipmentIds: resp.equipmentIds,
        });
      })
      .catch(() => alert('Nie udało się pobrać rezerwacji'));
  }, [id, userId]);

  const handleUpdate = (formValues: ReservationRequestDTO) => {
    axios
      .put<ReservationResponseDTO>(`http://localhost:8080/reservations/${id}`, formValues)
      .then(() => navigate('/reservations'))
      .catch(err => alert(err.response?.data?.message || 'Błąd przy aktualizacji'));
  };

  return initialData ? (
    <ReservationForm
      userId={userId}               // <- przekazujemy userId do formularza
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  ) : (
    <div>Ładowanie danych rezerwacji…</div>
  );
};

export default EditReservation;