export type ReservationType = "single" | "recurring";

export type ReservationFormValues = {
  type: ReservationType;
  title: string;
  date?: string;
  startHour: string;
  atendees: number;
  equipment: string[];
  software: string[];
  roomId?: string;
  
  startDate?: string;
  endDate?: string;
  frequency?: FrequencyOption;
  interval?: number;
  byDays?: DayOfWeek[];
  byMonthDays?: number[];
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

export interface RecurringReservationResponseDTO {
  recurringReservationId: string;
  roomId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  frequency: FrequencyOption;
  interval: number;
  byDays: DayOfWeek[];
  status: string;
  reservations: ReservationResponseDTO[];
}