import type { FC } from "react";
import deleteReservation from "./delete-reservation.ts";
import showToast from "../../../hooks/show-toast.ts";
import type { Dispatch } from "react";
import type { Action } from "../../../store/events-reducer.ts";
import { useAuth } from "../../../auth/auth-context.tsx";
import { useRecurrenceMap } from "../../../hooks/use-recurrence-map.ts";

interface DeleteReservationButtonProps {
  reservationId: string;
  reservationType: "single" | "recurring";
  onFinishedEditing: () => void;
  dispatch: Dispatch<Action>;
  resetForm: () => void;
}

const DeleteReservationButton: FC<DeleteReservationButtonProps> = ({
  reservationId,
  reservationType,
  onFinishedEditing,
  dispatch,
  resetForm,
}) => {
  const { token } = useAuth();
  if (!token) return;
  const { recurrenceMap } = useRecurrenceMap();
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć rezerwację?"
    );
    if (!confirmDelete) return;

    try {
      await deleteReservation(reservationId, reservationType, token);
      showToast("Rezerwacja usunięta", { variant: "success" });
      if (reservationType === "single") {
        dispatch({
          type: "removeEvent",
          payload: reservationId,
        });
      } else {
        const previousSingleReservations =
          recurrenceMap[reservationId].reservations;
        previousSingleReservations.forEach((singleReservation) =>
          dispatch({
            type: "removeEvent",
            payload: singleReservation.reservationId,
          })
        );
      }

      onFinishedEditing();
      resetForm();
    } catch (err) {
      showToast("Nie udało się usunąć", {
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="btn text-sm border-none bg-warning hover:text-red-800"
    >
      Usuń
    </button>
  );
};

export default DeleteReservationButton;
