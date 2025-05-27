export type ReservationFormValues = {
  title: string;
  date: string;
  startHour: string;
  repeats: string;
  atendees: number;
  equipment: string[];
  software: string[];
};

export type EditableReservation = ReservationFormValues & { id: string };

export interface ReservationRequestDTO {
  userId: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
}

export interface ReservationResponseDTO {
  reservationId: string;
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
