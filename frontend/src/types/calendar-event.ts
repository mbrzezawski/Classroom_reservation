import type { DayOfWeek, FrequencyOption } from "./reservations";

export type FullCalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;
  extendedProps: {
    roomName: string;
    roomLocation: string;
    atendees: number;
    equipment: string[];
    software: string[];
    recurrenceProps?: {
      recurrenceId: string;
      startDate: string;
      endDate: string;
      frequency: FrequencyOption;
      interval: number;
      byMonthDays: number[];
      byDays: DayOfWeek[];
    };
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
  end: string; // lub `Date`
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
};
