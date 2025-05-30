import InputTextBox from "../ui/input-textbox.tsx";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./reserving/date-hour-picker";
import RepeatsAtendeesPicker from "./reserving/repeats-atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import submitReservation from "./reserving/submit-reservation.ts";
import { useEffect, useState, type Dispatch, type FC } from "react";
import showToast from "../../hooks/show-toast.ts";
import type { Action } from "../../store/events-reducer.ts";
import { useRoomsMap } from "../../hooks/use-rooms-map.tsx";
import type { Room } from "../../types/room.ts";
import buildStartEndDate from "../../utils/build-start-end-date.ts";
import type { EditableReservation, ReservationFormValues } from "../../types/reservations.ts";
import DeleteReservationButton from "./reserving/delete-reservation-button.tsx";


interface ReservationFormProps {
  userId: string;
  dispatch: Dispatch<Action>;
  mode: "create" | "edit";
  onFinishedEditing: () => void;
  reservationId?: string;
  editValues?: EditableReservation | null;
}

const defaultValues: ReservationFormValues = {
  title: "",
  date: "",
  startHour: "",
  repeats: "None",
  atendees: 0,
  equipment: [],
  software: [],
};

const ReservationForm: FC<ReservationFormProps> = ({userId, dispatch, mode, onFinishedEditing, reservationId, editValues}) => {

  const methods = useForm({
    defaultValues: editValues || defaultValues
  });
  const { register, handleSubmit, reset } = methods;
  
  useEffect(() => {
    if (mode === "edit" && editValues) {
      reset(editValues);
    }
  }, [mode, editValues, reset]);

  const roomsMap = useRoomsMap();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLabel = isSubmitting
    ? mode === "create" ? "Booking..." : "Saving..."
    : mode === "create" ? "Book" : "Save changes";

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitReservation(data, userId, mode, reservationId);

      const [startTime, endTime] = buildStartEndDate(data.date, data.startHour)

      const room: Room = roomsMap[response.roomId];
      showToast(
        mode === "create" ? "Booking succeeded" : "Reservation updated",
        {
          description: `Room ${room.name} (${room.location}) ${mode === "create" ? "booked" : "updated"} for  
          ${startTime.toTimeString().slice(0, 5)}-${endTime.toTimeString().slice(0, 5)} ${data.date}`,
          variant: "success",
        }
      );
      const newEvent = {
          id: response.reservationId,
          title: data.title,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: {
            roomName: room.name,
            roomLocation: room.location,
            atendees: data.atendees,
            equipment: data.equipment,
            software: data.software,
          },
        }
      
      if (mode === "edit"){
        dispatch({ type: "updateEvent", payload: { oldId: reservationId!, newEvent } });
        onFinishedEditing();
      }
      else
        dispatch({ type: "addEvent", payload: newEvent });

      reset(defaultValues);
    } catch (error) {
      showToast("Booking failed", {
        description: error instanceof Error ? error.message : "Unknown error appeared",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px]"
      >
        {mode === "edit" ? (
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold">Edit reservation</h2>
    <DeleteReservationButton
      reservationId={reservationId!}
      onFinishedEditing={onFinishedEditing}
      dispatch={dispatch}
      resetForm={() => reset(defaultValues)}
    />
  </div>
) : (
  <h2 className="text-xl font-bold">New reservation</h2>
)}

        <InputTextBox
          label="Title"
          placeholder="Enter meeting title"
          icon={<Letter />}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters long",
            },
          })}
          error={methods.formState.errors.title?.message}
        />

        <DateHourPicker />
        <RepeatsAtendeesPicker />
        <FeaturesPicker />

        <button
          type="submit"
          className="btn rounded-[6px]"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
        {mode === "edit" && (
        <button
          type="button"
          className="btn bg-red-500 text-white rounded-[6px]"
          onClick={() => {
            onFinishedEditing();
            reset(defaultValues);
          }}
        >
          Cancel editing
        </button>
      )}
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
