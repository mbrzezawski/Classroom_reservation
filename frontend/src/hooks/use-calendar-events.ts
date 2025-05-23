import { useEffect, useReducer } from "react";
import { API_URL } from "../api";
import type { CalendarReservationDto, FullCalendarEvent } from "../types/calendar-event";
import showToast from "./show-toast";

export type Action =
  | { type: "setEvents"; payload: FullCalendarEvent[] }
  | { type: "addEvent"; payload: FullCalendarEvent }
  | { type: "removeEvent"; payload: string } // id
  | { type: "updateEvent"; payload: FullCalendarEvent };

function eventsReducer(events: FullCalendarEvent[], action: Action): FullCalendarEvent[] {
  switch (action.type) {
    case "setEvents":
      return action.payload;
    case "addEvent":
      return [...events, action.payload];
    // case "removeEvent":
    //   return events.filter(event => event.id !== action.payload);
    // case "updateEvent":
    //   return events.map(event =>
    //     event.id === action.payload.id ? action.payload : event
    //   );
    default:
      return events;
  }
}


function useCalendarEvents(userId: string) {
    const [events, dispatch] = useReducer(eventsReducer, []);

    useEffect(() =>{
        if(!userId) return

        fetch(`${API_URL}/reservations/calendar?userId=${userId}`)
        .then((res) => res.json())
        .then((data: CalendarReservationDto[]) =>{
            const mappedEvents: FullCalendarEvent[] = data.map((event: CalendarReservationDto) => ({ // use map-response-to-event
                id: event.reservationId,
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: {
                    roomName: event.roomName,
                    roomLocation: event.roomLocation
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