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
import type { EditableReservation } from "../../pages/main-page.tsx";

export type ReservationFormValues = {
  title: string;
  date: string;
  startHour: string;
  repeats: string;
  atendees: number;
  equipment: string[];
  software: string[];
};

interface ReservationFormProps {
  userId: string;
  dispatch: Dispatch<Action>;
  mode: "create" | "edit";
  reservationId?: string;
  editValues?: EditableReservation | null;
}

const ReservationForm: FC<ReservationFormProps> = ({
  userId,
  dispatch,
  mode,
  reservationId,
  editValues,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: editValues || {
      title: "",
      date: "",
      startHour: "",
      repeats: "None",
      atendees: 0,
      equipment: [],
      software: [],
    },
  });

  const { register, handleSubmit, reset } = methods;

  useEffect(() => {
    if (editValues && mode === "edit") {
      reset(editValues);
    }
  }, [editValues, mode, reset]);

  const roomsMap = useRoomsMap();

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitReservation(
        data,
        userId,
        mode,
        reservationId
      );
      const [year, month, day] = data.date.split("-").map(Number);
      const startHour = data.startHour;
      const [hours, minutes] = startHour.split(":").map(Number);
      const startTime = new Date(year, month - 1, day, hours, minutes);
      const endTime = new Date(year, month - 1, day, hours, minutes + 90);

      const room: Room = roomsMap[response.roomId];
      showToast(
        mode === "create" ? "Booking succeeded" : "Reservation updated",
        {
          description: `Room ${room.name} (${room.location}) ${
            mode === "create" ? "booked" : "updated"
          } for  ${startTime.toTimeString().slice(0, 5)}-${endTime
            .toTimeString()
            .slice(0, 5)} ${data.date}`,
          variant: "success",
        }
      );

      dispatch({
        type: mode === "create" ? "addEvent" : "updateEvent",
        payload: {
          id: response.reservationId, // lub po prostu reservationId (zalezy od backendu)
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
        },
      });

      reset();
    } catch (error) {
      showToast("Booking failed", {
        description:
          error instanceof Error ? error.message : "Unknown error appeared",
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
        <h2 className="text-xl font-bold">
          {mode === "create" ? "New reservation" : "Edit reservation"}
        </h2>

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
          {isSubmitting
            ? mode === "create"
              ? "Booking..."
              : "Saving..."
            : mode === "create"
            ? "Book"
            : "Save changes"}
        </button>
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
