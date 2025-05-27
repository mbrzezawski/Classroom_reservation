import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm, {
  type ReservationFormValues,
} from "../components/reservation/reservation-form";
import { Toaster } from "sonner";
import useCalendarEvents from "../hooks/use-calendar-events";
import { useState } from "react";

export type EditableReservation = ReservationFormValues & { id: string };

const MainPage = () => {
  const userId = "682b8bc9811311363ff183d0";
  const { events, dispatch } = useCalendarEvents(userId);

  const [editEvent, setEditEvent] = useState<EditableReservation | null>(null);

  return (
    <Layout>
      <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
        <div className="col-span-2">
          <MyCalendar
            events={events}
            onEventClick={(event) => {
              if (!event.start) return;
              const startDate = new Date(event.start);
              setEditEvent({
                id: event.id,
                title: event.title,
                date: startDate.toISOString().split("T")[0],
                startHour: startDate.toTimeString().slice(0, 5),
                atendees: event.extendedProps.atendees,
                equipment: event.extendedProps.equipment,
                software: event.extendedProps.software,
                repeats: "None",
              });
            }}
          />
        </div>
        <ReservationForm
          userId={userId}
          dispatch={dispatch}
          mode={editEvent ? "edit" : "create"}
          reservationId={editEvent?.id}
          editValues={editEvent}
        />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </Layout>
  );
};

export default MainPage;
