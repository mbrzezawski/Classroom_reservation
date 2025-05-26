import InputTextBox from "../ui/input-textbox.tsx";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./reserving/date-hour-picker";
import RepeatsAtendeesPicker from "./reserving/repeats-atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import postReservation from "./reserving/post-reservation.ts";
import { useState, type Dispatch, type FC } from "react";
import showToast from "../../hooks/show-toast.ts";
import type { Action } from "../../hooks/use-calendar-events.ts";
import { useRoomsMap } from "../../hooks/userRoomsMap.tsx";
import type { Room } from "../../types/room.ts";

export type ReservationFormValues = {
  title: string;
  date: string; // ISO format: "2024-06-10"
  startHour: string; // HH:MM to jest godzina początkowa (zakladam ze zajecia zawsze trwaja 1,5h ale to mozna i tak latwo zmienic)
  repeats: string;
  atendees: number;
  equipment: string[];
  software: string[];
};

interface ReservationFormProps {
  userId: string;
  dispatch: Dispatch<Action>;
}

const ReservationForm: FC<ReservationFormProps> = ({ userId, dispatch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      title: "",
      date: "",
      startHour: "",
      repeats: "None",
      atendees: 20,
      equipment: [],
      software: [],
    },
  });

  const { register, handleSubmit, reset } = methods;

  const roomsMap = useRoomsMap();

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await postReservation(data, userId);
      console.log("response body: ", response);
      const [year, month, day] = data.date.split("-").map(Number);
      const startHour = data.startHour;
      const [hours, minutes] = startHour.split(":").map(Number);
      const startTime = new Date(year, month - 1, day, hours, minutes)
        .toTimeString()
        .slice(0, 5);
      const endTime = new Date(year, month - 1, day, hours, minutes + 90)
        .toTimeString()
        .slice(0, 5);
      const room: Room = roomsMap[response.roomId];
      showToast("Booking succed", {
        description: `Room ${room.name} (${room.location}) booked for  ${startTime}-${endTime} ${data.date}`,
        variant: "success",
      });

      // dispatch({ type: "addEvent" }); TODO MAP response to FullCalendarEvent and add

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
        <h2 className="text-xl font-bold">New reservation</h2>

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
          {isSubmitting ? "Booking..." : "Book"}
        </button>
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
