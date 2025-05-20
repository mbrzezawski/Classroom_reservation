import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';
import type { EventApi, EventContentArg } from '@fullcalendar/core';
import classes from './css/CalendarView.module.css';

interface CalendarViewProps {
    userId: string;
}

interface ReservationDto {
    reservationId: string;
    title: string;
    start: string;
    end: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ userId }) => {
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/reservations/calendar?userId=${userId}`)
            .then(res => res.json())
            .then((data: ReservationDto[]) => {
                const api = calendarRef.current?.getApi();
                if (!api) return;
                api.removeAllEvents();
                data.forEach(evt =>
                    api.addEvent({
                        id: evt.reservationId,
                        title: evt.title,
                        start: evt.start,
                        end: evt.end,
                    })
                );
                setCurrentEvents(api.getEvents());
            })
            .catch(console.error);
    }, [userId]);

    const eventTimeFormat = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const renderEventContent = (arg: EventContentArg) => (
        <span className={classes.eventPill}>
    {arg.timeText} {arg.event.title}
  </span>
    );

    return (
        <div className={classes.calendarContainer}>
            <FullCalendar
                ref={calendarRef}
                firstDay={1}
                locale={plLocale}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,today,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="dayGridMonth"
                selectable
                editable
                selectMirror
                dayMaxEvents
                weekends
                eventsSet={events => setCurrentEvents(events)}
                eventTimeFormat={eventTimeFormat}
                eventContent={renderEventContent}
                height="auto"
                className={classes.fullCalendar}
            />
        </div>
    );
};

export default CalendarView;
