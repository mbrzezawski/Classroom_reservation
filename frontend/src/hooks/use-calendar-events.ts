import { useEffect, useReducer } from "react";
import { API_URL } from "../api";
import type { CalendarReservationDto, FullCalendarEvent } from "../types/calendar-event";
import showToast from "./show-toast";
import eventsReducer from "../store/events-reducer";

  function useCalendarEvents(userId: string) {
    const [events, dispatch] = useReducer(eventsReducer, []);
    useEffect(() => {
    console.log("Aktualne eventy:", events);
    }, [events]);
    useEffect(() =>{
        if(!userId) return

        fetch(`${API_URL}/reservations/calendar?userId=${userId}`)
        .then((res) => res.json())
        .then((data: CalendarReservationDto[]) =>{
            const mappedEvents: FullCalendarEvent[] = data.map((event: CalendarReservationDto) => ({
                id: event.reservationId,
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: {
                    roomName: event.roomName,
                    roomLocation: event.roomLocation,
                    atendees: event.minCapacity,
                    equipment: event.equipmentIds,
                    software: event.softwareIds
                }
            }))
            dispatch({type: "setEvents", payload: mappedEvents});
        })
        .catch((err) => {
            showToast("Error while loading reservations",{variant: "destructive"})
            console.log("Error while loading reservations", err)
        })

    }, [userId]);
    return {events, dispatch};
}
export default useCalendarEvents