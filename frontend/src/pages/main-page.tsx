import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";
import { Toaster } from "sonner";
import useCalendarEvents from "../hooks/use-calendar-events";
import type { EditableReservation } from "../types/reservations";
import SearchBar from "../components/lists/search-bar.tsx";
import { useUsers } from "../hooks/use-users.ts";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../auth/auth-context.tsx";
import { RoleType } from "../types/user-role.ts";

const MainPage = () => {
  const { user } = useAuth();
  if (!user) {
    return;
  }
  const userId = user.id;
  const userRole = user.role;

  const location = useLocation();
  const { users } = useUsers();

  const initialUserId = location.state?.userId ?? null;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const effectiveUserId = selectedUserId ?? initialUserId ?? "";

  const { events, dispatch } = useCalendarEvents(
    userRole == RoleType.DEANS_OFFICE ? effectiveUserId : userId
  );

  const [editEvent, setEditEvent] = useState<EditableReservation | null>(null);

  return (
    <Layout>
      <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
        <div className="col-span-2 flex flex-col gap-4">
          {userRole === "DEANS_OFFICE" && (
            <div className="relative z-10">
              <SearchBar users={users} onSelectUser={setSelectedUserId} />
            </div>
          )}
          <div className="relative z-0">
            <MyCalendar
              events={events}
              onEventClick={(event) => {
                if (!event.start) return;
                const startDate = new Date(event.start);
                setEditEvent({
                  id: event.id,
                  type: "single",
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
        </div>
        <ReservationForm
          userId={userRole === "DEANS_OFFICE" ? effectiveUserId : userId}
          role={userRole}
          dispatch={dispatch}
          mode={editEvent ? "edit" : "create"}
          reservationId={editEvent?.id}
          editValues={editEvent}
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
