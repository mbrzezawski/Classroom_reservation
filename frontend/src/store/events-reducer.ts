import type { FullCalendarEvent } from "../types/calendar-event";

export type Action =
  | { type: "setEvents"; payload: FullCalendarEvent[] }
  | { type: "addEvent"; payload: FullCalendarEvent }
  | { type: "removeEvent"; payload: string } // id
  | { type: "updateEvent"; payload: { oldId: string; newEvent: FullCalendarEvent } }


function eventsReducer(events: FullCalendarEvent[], action: Action): FullCalendarEvent[] {
  switch (action.type) {
    case "setEvents":
      return action.payload;
    case "addEvent":
      return [...events, action.payload];
    case "removeEvent":
      return events.filter(event => event.id !== action.payload);
    case "updateEvent":
      return events
        .filter(event => event.id !== action.payload.oldId)
        .concat(action.payload.newEvent);
    default:
      return events;
  }
}

export default eventsReducer