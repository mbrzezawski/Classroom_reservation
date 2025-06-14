import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import { Toaster } from "sonner";
import useCalendarEvents from "../hooks/use-calendar-events";
import SearchBar from "../components/lists/search-bar.tsx";
import { useUsers } from "../hooks/use-users.ts";
import { useState } from "react";

import { useAuth } from "../auth/auth-context.tsx";
import { RoleType } from "../types/user-role.ts";
import ReservationFormWrapper from "../components/reservation/reservation-form-wrapper.tsx";
import type { FullCalendarEvent } from "../types/calendar-event.ts";

const MainPage = () => {
<<<<<<< dev-idk
  const userId = "682b8bc4811311363ff183cf";
  const userRole = "DEANS_OFFICE";
        
  const location = useLocation();
=======
  const { user } = useAuth();
  if (!user) {
    return;
  }
  const userId = user.id;
  const userRole = user.role;
>>>>>>> main
  const { users } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const effectiveUserId = selectedUserId ?? userId ?? "";

  const { events, dispatch } = useCalendarEvents(
    userRole == RoleType.DEANS_OFFICE ? effectiveUserId : userId
  );

  const [editedEvent, setEditEvent] = useState<FullCalendarEvent | null>(null);

  return (
<<<<<<< dev-idk
    <Layout userRole={userRole}>
        <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
            <div className="col-span-2 flex flex-col gap-4">
                { userRole === "DEANS_OFFICE" &&
                    (<div className="relative z-10">
                        <SearchBar users={users} onSelectUser={setSelectedUserId} />
                    </div>)
                }
                <div className="relative z-0">
                    <MyCalendar
                      events={events}
                      onEventClick={(event) => {
                        if (!event.start) return;
                        const startDate = new Date(event.start);
                        setEditEvent({
                          id: event.id,
                          type: 'single',
                          title: event.title,
                          date: startDate.toISOString().split("T")[0],
                          startHour: startDate.toTimeString().slice(0, 5),
                          atendees: event.extendedProps.atendees,
                          equipment: event.extendedProps.equipment,
                          software: event.extendedProps.software,
                          roomId: event.extendedProps.roomId,
                        });
                      }}
                    />
                </div>
=======
    <Layout>
      <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
        <div className="col-span-2 flex flex-col gap-4">
          {userRole === "DEANS_OFFICE" && (
            <div className="relative z-10">
              <SearchBar users={users} onSelectUser={setSelectedUserId} />
>>>>>>> main
            </div>
          )}
          <div className="relative z-0">
            <MyCalendar
              events={events}
              onEventClick={(event) => {
                if (!event.start || !event.end) return;
                const calendarEvent: FullCalendarEvent = {
                  id: event.id,
                  title: event.title,
                  start: event.start?.toISOString(),
                  end: event.end?.toISOString(),
                  extendedProps: {
                    roomName: event.extendedProps.roomName,
                    roomLocation: event.extendedProps.roomLocation,
                    atendees: event.extendedProps.atendees,
                    equipment: event.extendedProps.equipment,
                    software: event.extendedProps.software,
                    recurrenceProps: event.extendedProps.recurrenceProps
                      ? { ...event.extendedProps.recurrenceProps }
                      : undefined,
                  },
                };
                setEditEvent(calendarEvent);
              }}
            />
          </div>
        </div>
        <ReservationFormWrapper
          userId={effectiveUserId}
          role={userRole}
          dispatch={dispatch}
          editedEvent={editedEvent}
          onFinishedEditing={() => {
            setEditEvent(null);
          }}
        />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </Layout>
  );
};

export default MainPage;
