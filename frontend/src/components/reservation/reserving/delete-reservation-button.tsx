import type { FC } from "react";
import deleteReservation from "./delete-reservation.ts";
import showToast from "../../../hooks/show-toast.ts";
import { useAuth } from "../../../auth/auth-context.tsx";

interface DeleteReservationButtonProps {
  reservationId: string;
  reservationType: "single" | "recurring";
  resetForm: () => void;
  onFinishedRequest: () => void;
}

const DeleteReservationButton: FC<DeleteReservationButtonProps> = ({
  reservationId,
  reservationType,
  resetForm,
  onFinishedRequest,
}) => {
  const { token } = useAuth();
  if (!token) return;
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć rezerwację?"
    );
    if (!confirmDelete) return;

    try {
      await deleteReservation(reservationId, reservationType, token);
      showToast("Rezerwacja usunięta", { variant: "success" });
    } catch (err) {
      showToast("Nie udało się usunąć", {
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      onFinishedRequest();
      resetForm();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="btn btn-warning text-sm border-none"
    >
      Usuń
    </button>
  );
};

export default DeleteReservationButton;
