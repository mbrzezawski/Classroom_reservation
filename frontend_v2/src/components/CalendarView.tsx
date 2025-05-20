import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { formatDate } from '@fullcalendar/core';
import plLocale from '@fullcalendar/core/locales/pl';

import type {
  EventApi,
  DateSelectArg,
  EventContentArg,
  EventClickArg
} from '@fullcalendar/core';

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
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    fetch(
      `http://localhost:8080/reservations/calendar?userId=${userId}`
    )
.then((res) => res.json())
    .then((data: ReservationDto[]) => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        api.removeAllEvents();

        data.forEach((evt) =>
            api.addEvent({
                id: evt.reservationId,
                title: evt.title,
                start: evt.start,
                end: evt.end,
            })
        );

        setCurrentEvents(api.getEvents());
    })
    .catch((err) => {
        console.error('Failed to fetch events:', err);
    });
}, [userId]);


const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('Enter event title');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
        calendarApi.addEvent({
            id: String(Date.now()),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
        });
        setCurrentEvents(calendarApi.getEvents());
    }
};

const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Delete event '${clickInfo.event.title}'?`)) {
        clickInfo.event.remove();
        setCurrentEvents(calendarRef.current?.getApi().getEvents() || []);
    }
};

const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events);
};

const renderEventContent = (eventContent: EventContentArg) => (
    <>
        <b>{eventContent.timeText}</b> <i>{eventContent.event.title}</i>
    </>
);

const renderSidebarEvent = (event: EventApi) => (
    <li key={event.id}>
        <b>
            {formatDate(event.start!, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })}
        </b>{' '}
        <i>{event.title}</i>
    </li>
);

return (
    <div style={{ display: 'flex' }}>
        {/* <aside style={{ width: '20%', padding: '1rem', backgroundColor: '#f8f9fa' }}>
        <h2>Wszystkie wydarzenia ({currentEvents.length})</h2>
        <ul>{currentEvents.map(renderSidebarEvent)}</ul>
      </aside> */}

        <main style={{ flex: 1, padding: '1rem' }}>
            <FullCalendar
                ref={calendarRef}
                firstDay={1}
                locale={plLocale}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="dayGridMonth"
                selectable
                editable
                selectMirror
                dayMaxEvents
                weekends
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventsSet={handleEvents}
                eventContent={renderEventContent}
                height="auto"
            />
        </main>
    </div>
);
};

export default CalendarView;
