import type { FullCalendarEvent } from "../types/calendar-event";
import type { RecurringReservationFormValues, ReservationResponseDTO, SingleReservationFormValues } from "../types/reservations";
import type { Room } from "../types/room";

export function mapSingleReservationResponsetoCalendarEvent(
  dto: ReservationResponseDTO,
  room: Room
): FullCalendarEvent {
  return {
    id: dto.reservationId,
    title: dto.purpose,
    start: dto.start,
    end: dto.end,
    extendedProps: {
      roomName: room.name,
      roomLocation: room.location,
      atendees: dto.minCapacity,
      equipment: dto.equipmentIds,
      software: dto.softwareIds,
      // roomId: dto.roomId
    },
  };
}

export function mapCalendarEventToSingleValues(event: FullCalendarEvent): SingleReservationFormValues{
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  return {
    type: 'single',
    title: event.title,
    date: startDate.toISOString().split("T")[0],
    startHour: startDate.toTimeString().slice(0,5),
    endHour: endDate.toTimeString().slice(0,5),
    atendees: event.extendedProps.atendees,
    equipment: event.extendedProps.equipment,
    software: event.extendedProps.software,
  }
}

export function mapCalendarEventToRecurringValues(event: FullCalendarEvent): RecurringReservationFormValues{
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const startHour = startDate.toTimeString().slice(0,5)
  const endHour = endDate.toTimeString().slice(0,5)
  if (!event.extendedProps.recurrenceProps)
    return {
      type: 'recurring',
      title: event.title,
      startDate: "",
      endDate: "",
      startHour: startHour,
      endHour: endHour,
      atendees: event.extendedProps.atendees,
      equipment: event.extendedProps.equipment,
      software: event.extendedProps.software,
      frequency: "WEEKLY",
      interval: 1,
      byDays: [],
      byMonthDays: [],
    }
  return {
    type: 'recurring',
    title: event.title,
    startDate: event.extendedProps.recurrenceProps.startDate,
    endDate: event.extendedProps.recurrenceProps.endDate,
    startHour: startDate.toTimeString().slice(0,5),
    endHour: endDate.toTimeString().slice(0,5),
    atendees: event.extendedProps.atendees,
    equipment: event.extendedProps.equipment,
    software: event.extendedProps.software,
    frequency: event.extendedProps.recurrenceProps.frequency,
    interval: event.extendedProps.recurrenceProps.interval,
    byDays: event.extendedProps.recurrenceProps.byDays,
    byMonthDays: event.extendedProps.recurrenceProps.byMonthDays,
  }
}