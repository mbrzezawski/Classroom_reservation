import type { FullCalendarEvent } from "../types/calendar-event";

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

export default eventsReducer