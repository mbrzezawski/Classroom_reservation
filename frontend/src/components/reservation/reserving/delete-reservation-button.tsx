import type { FC } from "react";
import deleteReservation from "./delete-reservation.ts";
import showToast from "../../../hooks/show-toast.ts";
import type { Dispatch } from "react";
import type { Action } from "../../../store/events-reducer.ts";

interface DeleteReservationButtonProps {
  reservationId: string;
  onFinishedEditing: () => void;
  dispatch: Dispatch<Action>;
  resetForm: () => void;
}

const DeleteReservationButton: FC<DeleteReservationButtonProps> = ({
  reservationId,
  onFinishedEditing,
  dispatch,
  resetForm,
}) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirmDelete) return;

    try {
      await deleteReservation(reservationId);
      showToast("Reservation deleted", { variant: "success" });

      dispatch({
        type: "removeEvent",
        payload: reservationId ,
      });

      onFinishedEditing();
      resetForm();
    } catch (err) {
      showToast("Failed to delete reservation", {
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
};

export default DeleteReservationButton;
