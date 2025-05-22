import { useEffect, useState } from "react";
import { API_URL } from "../api";
import type { CalendarReservationDto, FullCalendarEvent } from "../types/calendar-event";

function useCalendarEvents(userId: string) {
    const [events, setEvents] = useState<FullCalendarEvent[]>([]) 

    useEffect(() =>{
        if(!userId) return

        fetch(`${API_URL}/reservations/calendar?userId=${userId}`).then((res) => res.json()).then((data: CalendarReservationDto[]) =>{
            const mappedEvents: FullCalendarEvent[] = data.map((event: CalendarReservationDto) => ({
                id: event.reservationId,
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: {
                    roomName: event.roomName,
                    roomLocation: event.roomLocation
                }
            }))
            setEvents(mappedEvents);
        }).catch((err) => console.error("Failed to fetch calendar events:", err))

    }, [userId]);
    return events;
}

export default useCalendarEvents