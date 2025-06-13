import { useEffect, useState } from "react";
import type { Dispatch, FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type {
  ReservationResponseDTO,
  ReservationType,
  SingleReservationFormValues,
} from "../../types/reservations";
import InputTextBox from "../ui/input-textbox";
import Letter from "../icons/letter";
import DeleteReservationButton from "./reserving/delete-reservation-button";
import DatePicker from "./reserving/date-picker";
import HourPicker from "./reserving/hour-picker";
import AtendeesPicker from "./reserving/atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import TypePicker from "./reserving/type-picker";
import submitSingleReservation from "./reserving/submit-single-reservation";
import { useAuth } from "../../auth/auth-context";
import type { Room } from "../../types/room";
import { useRoomsMap } from "../../hooks/use-rooms-map";
import showToast from "../../hooks/show-toast";
import {
  mapSingleReservationResponsetoCalendarEvent,
  mapCalendarEventToSingleValues,
} from "../../utils/reserving-mapping.ts";
import type { Action } from "../../store/events-reducer.ts";
import type { FullCalendarEvent } from "../../types/calendar-event.ts";
import { showReservationToast } from "../../utils/show-reservation-toast.ts";

interface Props {
  userId: string;
  role: string;
  dispatch: Dispatch<Action>;
  type: ReservationType;
  setType: (type: ReservationType) => void;
  editedEvent: FullCalendarEvent | null;
  onFinishedEditing: () => void;
}

const defaultValues: SingleReservationFormValues = {
  type: "single",
  title: "",
  date: "",
  startHour: "",
  endHour: "",
  atendees: 0,
  equipment: [],
  software: [],
  roomId: "",
};
const SingleReservationForm: FC<Props> = ({
  userId,
  role,
  dispatch,
  type,
  setType,
  editedEvent,
  onFinishedEditing,
}) => {
  const methods = useForm<SingleReservationFormValues>({
    defaultValues,
  });
  const { token } = useAuth();
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const { register, handleSubmit, reset } = methods;
  const roomsMap = useRoomsMap();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const mode = editedEvent ? "edit" : "create";
  const reservationId = editedEvent ? editedEvent.id : "";
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Booking..."
      : "Saving..."
    : mode === "create"
    ? "Book"
    : "Save changes";
  const [allowChangeToReccuring, setAllowChangeToRecurring] = useState(true);
  useEffect(() => {
    if (editedEvent && !editedEvent.extendedProps.recurrenceProps) {
      setType("single");
      setAllowChangeToRecurring(false);
    } else {
      setAllowChangeToRecurring(true);
    }
    console.log(allowChangeToReccuring);
  }, [editedEvent, type]);

  useEffect(() => {
    reset(
      editedEvent ? mapCalendarEventToSingleValues(editedEvent) : defaultValues
    );
  }, [editedEvent, reset]);

  const onSubmit = async (data: SingleReservationFormValues) => {
    setIsSubmitting(true);
    try {
      let response: ReservationResponseDTO;
      response = await submitSingleReservation(
        data,
        userId,
        token,
        mode,
        reservationId
      );
      console.log(response);
      const room: Room = roomsMap[response.roomId];

      const newCalendarEvent = mapSingleReservationResponsetoCalendarEvent(
        response,
        room
      );

      if (mode === "create")
        dispatch({ type: "addEvent", payload: newCalendarEvent });
      else
        dispatch({
          type: "updateEvent",
          payload: { oldId: reservationId, newEvent: newCalendarEvent },
        });

      showReservationToast(response, room, mode);
    } catch (error) {
      showToast("Booking failed", {
        description:
          error instanceof Error ? error.message : "Unknown error appeared",
        variant: "destructive",
      });
    } finally {
      onFinishedEditing();
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[8px] rounded-[8px]"
      >
        {/* pierwszy rzad */}
        <div className="flex justify-between items-center mb-2">
          {allowChangeToReccuring && (
            <TypePicker type={type} setType={setType} />
          )}
          <div className={mode !== "edit" ? "flex-1 ml-4" : ""}>
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
          </div>

          {mode === "edit" && (
            <DeleteReservationButton
              reservationId={reservationId}
              reservationType={type}
              onFinishedEditing={onFinishedEditing}
              dispatch={dispatch}
              resetForm={() => reset(defaultValues)}
            />
          )}
        </div>
        <div className="flex flex-row gap-2">
          <DatePicker field="date" />
          <HourPicker start={true} />
        </div>

        <div className="flex flex-row gap-2">
          <AtendeesPicker />
          <HourPicker start={false} />
        </div>

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

export default SingleReservationForm;
