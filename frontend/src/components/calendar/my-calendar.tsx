import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { FC } from "react";
import renderEventContent from "./render-event-content";
import type { FullCalendarEvent } from "../../types/calendar-event";

interface CalendarProps {
  events: FullCalendarEvent[];
}

const MyCalendar: FC<CalendarProps> = ({ events }) => {
  return (
    <FullCalendar
      key={events.length}
      plugins={[dayGridPlugin, timeGridPlugin]}
      weekends={false}
      events={events}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      eventContent={renderEventContent}
      eventClassNames={() => "!bg-transparent !p-0 !border-none shadow-none"}
      initialView="timeGridWeek"
      height="90vh"
      allDaySlot={false}
    ></FullCalendar>
  );
};

export default MyCalendar;
