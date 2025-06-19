import type { EventContentArg } from "@fullcalendar/core";

function formatTime(date?: Date | null) {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function renderEventContent(eventArg: EventContentArg) {
  const { event } = eventArg;
  const isPending = event.extendedProps.status === "PENDING";
  const color = isPending ? "btn-secondary" : "btn-primary";
  return (
    <div className="w-full h-full">
      <button className={`btn flex flex-col w-full h-full space-y-0 ${color}`}>
        <p className="text-sm font-bold truncate leading-tight">
          {event.title}
        </p>
        <p className="text-xs leading-none">
          {formatTime(event.start)} - {formatTime(event.end)}
        </p>
        {!isPending && (
          <p className="text-xs leading-none">
            s. {event.extendedProps.roomName} - bud.{" "}
            {event.extendedProps.roomLocation}
          </p>
        )}
      </button>
    </div>
  );
}

export default renderEventContent;
