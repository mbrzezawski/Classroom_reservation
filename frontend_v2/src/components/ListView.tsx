import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  status: string;
}

interface ListViewProps { userId: string; }

const ListView: React.FC<ListViewProps> = ({ userId }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/reservations?userId=${userId}`)
      .then(res => res.json())
      .then((data: Reservation[]) => setReservations(data));
  }, [userId]);

  return (
    <Table striped withColumnBorders>
      <thead>
        <tr><th>Data</th><th>Godzina</th><th>Sala</th><th>Cel</th></tr>
      </thead>
      <tbody>
        {reservations.map(r => (
          <tr key={r.id}>
            <td>{r.date}</td>
            <td>{r.startTime}–{r.endTime}</td>
            <td>{r.roomId}</td>
            <td>{r.purpose}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ListView;