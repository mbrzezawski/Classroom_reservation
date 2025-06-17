import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { FC } from "react";
import renderEventContent from "./render-event-content";
import type { FullCalendarEvent } from "../../types/calendar-event";
import type { EventApi } from "@fullcalendar/core";
import plLocale from "@fullcalendar/core/locales/pl";

interface CalendarProps {
  events: FullCalendarEvent[];
  onEventClick: (event: EventApi) => void;
}

const MyCalendar: FC<CalendarProps> = ({ events, onEventClick }) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      headerToolbar={{
        start: "prev",
        center: "title",
        end: "today next",
      }}
      weekends={false}
      events={events}
      eventClick={(arg) => onEventClick(arg.event)}
      slotMinTime="08:00:00"
      slotMaxTime="22:00:00"
      eventContent={renderEventContent}
      eventClassNames={() => "!bg-transparent !p-0 !border-none shadow-none"}
      initialView="timeGridWeek"
      dayHeaderClassNames="bg-neutral text-base-100 font-medium text-sm"
      contentHeight="auto"
      allDaySlot={false}
      locale={plLocale}
      titleFormat={{ year: "numeric", month: "long", day: "numeric" }}
    ></FullCalendar>
  );
};

export default MyCalendar;
