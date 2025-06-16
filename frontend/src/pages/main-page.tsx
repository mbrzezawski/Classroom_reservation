import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import useCalendarEvents from "../hooks/use-calendar-events";
import SearchBar from "../components/lists/search-bar.tsx";
import { useUsers } from "../hooks/use-users.ts";
import { useState } from "react";
import { useAuth } from "../auth/auth-context.tsx";
import { RoleType } from "../types/user-role.ts";
import ReservationFormWrapper from "../components/reservation/reservation-form-wrapper.tsx";
import type { FullCalendarEvent } from "../types/calendar-event.ts";
import {useLocation} from "react-router-dom";

const MainPage = () => {
  const { user } = useAuth();
  if (!user) {
    return;
  }
  const userId = user.id;
  // const userRole = user.role;
  const userRole = RoleType.DEANS_OFFICE;

  const { users } = useUsers();
  const location = useLocation();
  const initialUserId = location.state?.userId as string | null;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId);
  const effectiveUserId = selectedUserId ?? userId ?? "";
  const { events, dispatch } = useCalendarEvents(
    userRole == RoleType.DEANS_OFFICE ? effectiveUserId : userId
  );
  const [editedEvent, setEditEvent] = useState<FullCalendarEvent | null>(null);

  return (
    <Layout userRole={userRole}>
      <div className="grid grid-cols-3  gap-4 p-4">
        <div className="col-span-2 flex flex-col gap-4">
          {userRole === RoleType.DEANS_OFFICE && (
            <div className="relative z-10">
              <SearchBar users={users} onSelectUser={setSelectedUserId} />
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
                    status: event.extendedProps.status,
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
        <div className="h-full">
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
      </div>
    </Layout>
  );
};

export default MainPage;
