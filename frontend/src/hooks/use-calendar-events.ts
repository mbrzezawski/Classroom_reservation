import { useEffect, useReducer } from "react";
import { API_URL } from "../api";
import { useAuth } from "../auth/auth-context";
import eventsReducer from "../store/events-reducer";
import showToast from "./show-toast";
import type { CalendarReservationDto, FullCalendarEvent } from "../types/calendar-event";
import type { RecurringReservationResponseDTO } from "../types/reservations";

function useCalendarEvents(userId: string) {
  const [events, dispatch] = useReducer(eventsReducer, []);
  const { token } = useAuth();

  useEffect(() => {
    if (!userId || !token) return;

    const fetchEvents = async () => {
      try {
        const [resEvents, resRecurring] = await Promise.all([
          fetch(`${API_URL}/reservations/calendar?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/recurring-reservations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const eventData: CalendarReservationDto[] = await resEvents.json();
        const recurringData: RecurringReservationResponseDTO[] = await resRecurring.json();
        const recurrenceMap: Record<string, RecurringReservationResponseDTO> = Object.fromEntries(
          recurringData.map((r) => [r.id, r])
        );

        const mappedEvents: FullCalendarEvent[] = eventData.map((event) => {
          const recurrenceData = event.recurrenceId ? recurrenceMap[event.recurrenceId] : undefined;
          
          const recurrenceProps = recurrenceData ? {
            recurrenceId: event.recurrenceId,
            startDate: recurrenceData.startDate,
            endDate: recurrenceData.endDate,
            frequency: recurrenceData.frequency,
            interval: recurrenceData.interval,
            byMonthDays: recurrenceData.byMonthDays,
            byDays: recurrenceData.byDays,
          } : undefined;

          return {
            id: event.reservationId,
            title: event.title,
            start: event.start,
            end: event.end,
            extendedProps: {
              roomName: event.roomName,
              roomLocation: event.roomLocation,
              atendees: event.minCapacity,
              equipment: event.equipmentIds,
              software: event.softwareIds,
              recurrenceProps,
            },
          };
        });
        dispatch({ type: "setEvents", payload: mappedEvents });
      } catch (err) {
        showToast("Error while loading reservations", {
          variant: "destructive",
        });
        console.error("Error while loading reservations", err);
      }
    };

    fetchEvents();
  }, [userId, token]);

  return { events, dispatch };
}

export default useCalendarEvents