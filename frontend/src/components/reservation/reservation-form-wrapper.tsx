import { useState, type Dispatch, type FC } from "react";
import SingleReservationForm from "./single-reservation-form";
import RecurringReservationForm from "./recurring-reservation-form";
import type { ReservationType } from "../../types/reservations";
import type { Action } from "../../store/events-reducer.ts";
import type { RoleType } from "../../types/user-role.ts";
import type { FullCalendarEvent } from "../../types/calendar-event.ts";

interface ReservationFormWrapperProps {
    userId: string;
    role: RoleType;
    dispatch: Dispatch<Action>;
    editedEvent: FullCalendarEvent | null;
    onFinishedEditing: () => void;
}

const ReservationFormWrapper: FC<ReservationFormWrapperProps> = ({ userId, role, dispatch, editedEvent, onFinishedEditing }) => {
const [type, setType] = useState<ReservationType>("single");

return (
  <>
    {type === "single" ? (
      <SingleReservationForm userId={userId} role={role} dispatch={dispatch} type={type} setType={setType} editedEvent={editedEvent} onFinishedEditing={onFinishedEditing}/>
    ) : (
      <RecurringReservationForm userId={userId} role={role}  dispatch={dispatch} type={type} setType={setType} editedEvent={editedEvent} onFinishedEditing={onFinishedEditing}/>
    )}
  </>
);
};

export default ReservationFormWrapper;
