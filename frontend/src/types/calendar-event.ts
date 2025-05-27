export type FullCalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;
  extendedProps: {
    roomName: string;
    roomLocation: string;
    atendees: Number;
    equipment: string[];
    software: string[];
  };
};

export type CalendarReservationDto = {
  reservationId: string;
  recurrenceId: string;
  roomId: string;
  roomName: string;
  roomLocation: string;
  title: string;
  start: string; // lub `Date` jeśli od razu parsujesz
  end: string;   // lub `Date`
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
};