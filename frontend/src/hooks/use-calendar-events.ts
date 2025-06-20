import { useCallback, useEffect, useReducer } from "react";
import { API_URL } from "../api";
import { useAuth } from "../auth/auth-context";
import eventsReducer from "../store/events-reducer";
import showToast from "./show-toast";
import type {
  CalendarReservationDto,
  FullCalendarEvent,
} from "../types/calendar-event";
import { useRecurrenceMap } from "./use-recurrence-map"; // import the custom hook

function useCalendarEvents(userId: string) {
  const [events, dispatch] = useReducer(eventsReducer, []);
  const { token } = useAuth();
  const { recurrenceMap, refetchRecurrenceMap } = useRecurrenceMap();

  const fetchEvents = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const resEvents = await fetch(
        `${API_URL}/reservations/calendar?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const eventData: CalendarReservationDto[] = await resEvents.json();
      const mappedEvents: FullCalendarEvent[] = eventData
        .filter(
          (event) =>
            event.reservationStatus !== "CANCELLED" &&
            !(event.reservationStatus === "PENDING" && event.recurrenceId)
        )
        .map((event) => {
          const recurrenceData = event.recurrenceId
            ? recurrenceMap[event.recurrenceId]
            : undefined;
          const recurrenceProps = recurrenceData
            ? {
                recurrenceId: event.recurrenceId,
                startDate: recurrenceData.startDate,
                endDate: recurrenceData.endDate,
                frequency: recurrenceData.frequency,
                interval: recurrenceData.interval,
                byMonthDays: recurrenceData.byMonthDays,
                byDays: recurrenceData.byDays,
              }
            : undefined;

          return {
            id: event.reservationId,
            title: event.title,
            start: event.start,
            end: event.end,
            extendedProps: {
              status: event.reservationStatus,
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
      showToast("Error while loading reservations", { variant: "destructive" });
      console.error("Error while loading reservations", err);
    }
  }, [userId, token, recurrenceMap]); // zostaje tu, bo potrzebujesz go do mapowania

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(async () => {
    await refetchRecurrenceMap(); // tylko tu
    await fetchEvents();
  }, [refetchRecurrenceMap, fetchEvents]);

  return { events, dispatch, refetch };
}

export default useCalendarEvents;
