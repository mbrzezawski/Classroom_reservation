export type ReservationType = "single" | "recurring";

export type SingleReservationFormValues = {
  type: ReservationType;
  title: string;
  date: string;
  startHour: string;
  endHour: string;
  atendees: number;
  equipment: string[];
  software: string[];
  roomId?: string;
};
export type RecurringReservationFormValues = {
  type: ReservationType;
  title: string;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
  atendees: number;
  equipment: string[];
  software: string[];
  roomId?: string;

  frequency: FrequencyOption;
  interval: number;
  byDays: DayOfWeek[];
  byMonthDays: number[];
};

export type EditableSingleReservation = SingleReservationFormValues & { id: string };
export type EditableRecurringReservation = RecurringReservationFormValues & { id: string };

export interface ReservationRequestDTO {
  userId: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  roomId?: string;
}

export type FrequencyOption = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface RecurringReservationRequestDTO {
  userId: string;
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  startTime: string;        // HH:mm
  endTime: string;          // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  frequency: FrequencyOption;
  interval: number;  
  byMonthDays: number[]
  byDays: DayOfWeek[];
  roomId?: string;
}

export interface ReservationResponseDTO {
  reservationId: string;
  userId: string;
  roomId: string;
  recurringReservationId: string;
  start: string; // ISO 8601 string (ZonedDateTime serialized)
  end: string;   // ISO 8601 string (ZonedDateTime serialized)
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  status: string;
}

export interface RecurringReservationResponseDTO {
  recurringReservationId: string;
  roomId: string;
  startDate: string; // LocalDate serialized as YYYY-MM-DD
  endDate: string;   // LocalDate serialized as YYYY-MM-DD
  startTime: string; // LocalTime serialized as HH:mm
  endTime: string;   // LocalTime serialized as HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  frequency: FrequencyOption;
  interval: number;
  byDays: DayOfWeek[];
  byMonthDays: number[];
  status: string;
  reservations: ReservationResponseDTO[];
}