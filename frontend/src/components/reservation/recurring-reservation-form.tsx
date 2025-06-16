import type { Dispatch, FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type {
  RecurringReservationFormValues,
  RecurringReservationResponseDTO,
  ReservationType,
} from "../../types/reservations";
import { useEffect, useState } from "react";
import InputTextBox from "../ui/input-textbox";
import Letter from "../icons/letter";
import DeleteReservationButton from "./reserving/delete-reservation-button";
import DatePicker from "./reserving/date-picker";
import HourPicker from "./reserving/hour-picker";
import AtendeesPicker from "./reserving/atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import RecurringOptions from "./reserving/recurring-options";
import TypePicker from "./reserving/type-picker";
import type { Action } from "../../store/events-reducer.ts";
import { useAuth } from "../../auth/auth-context.tsx";
import { useRoomsMap } from "../../hooks/use-rooms-map.tsx";
import submitRecurringReservation from "./reserving/submit-recurring-reservation.tsx";
import showToast from "../../hooks/show-toast.ts";
import {
  mapCalendarEventToRecurringValues,
  mapSingleReservationResponsetoCalendarEvent,
} from "../../utils/reserving-mapping.ts";
import type { Room } from "../../types/room.ts";
import type { FullCalendarEvent } from "../../types/calendar-event.ts";
import { showReservationToast } from "../../utils/show-reservation-toast.ts";
import { useRecurrenceMap } from "../../hooks/use-recurrence-map.ts";

interface Props {
  userId: string;
  role: string;
  dispatch: Dispatch<Action>;
  type: ReservationType;
  setType: (type: ReservationType) => void;
  editedEvent: FullCalendarEvent | null;
  onFinishedEditing: () => void;
}
const defaultValues: RecurringReservationFormValues = {
  type: "single",
  title: "",
  startDate: "",
  endDate: "",
  startHour: "",
  endHour: "",
  atendees: 0,
  equipment: [],
  software: [],
  roomId: "",

  frequency: "WEEKLY",
  interval: 1,
  byDays: [],
  byMonthDays: [],
};
const RecurringReservationForm: FC<Props> = ({
  userId,
  role,
  dispatch,
  type,
  setType,
  editedEvent,
  onFinishedEditing,
}) => {
  const methods = useForm<RecurringReservationFormValues>({
    defaultValues,
  });
  const { token } = useAuth();
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const { register, handleSubmit, reset } = methods;
  const roomsMap = useRoomsMap();
  const { recurrenceMap } = useRecurrenceMap();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const mode = editedEvent ? "edit" : "create";
  const recurrenceId =
    editedEvent && editedEvent.extendedProps.recurrenceProps
      ? editedEvent.extendedProps.recurrenceProps?.recurrenceId
      : "";
  console.log(recurrenceId);
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Booking..."
      : "Saving..."
    : mode === "create"
    ? "Book"
    : "Save changes";

  useEffect(() => {
    if (editedEvent && !editedEvent.extendedProps.recurrenceProps) {
      setType("single");
    }
  }, [editedEvent, type]);

  useEffect(() => {
    reset(
      editedEvent
        ? mapCalendarEventToRecurringValues(editedEvent)
        : defaultValues
    );
  }, [editedEvent, reset]);

  const onSubmit = async (data: RecurringReservationFormValues) => {
    setIsSubmitting(true);
    try {
      let response: RecurringReservationResponseDTO;
      response = await submitRecurringReservation(
        data,
        userId,
        token,
        mode,
        recurrenceId
      );
      const room: Room = roomsMap[response.roomId];

      const recurrenceProps = {
        recurrenceId: recurrenceId,
        startDate: response.startDate,
        endDate: response.endDate,
        frequency: response.frequency,
        interval: response.interval,
        byMonthDays: response.byMonthDays,
        byDays: response.byDays,
      };
      response.reservations.forEach((singleReservation) => {
        const newCalendarEvent = mapSingleReservationResponsetoCalendarEvent(
          singleReservation,
          room,
          recurrenceProps
        );

        if (mode === "create")
          dispatch({ type: "addEvent", payload: newCalendarEvent });
        else
          dispatch({
            type: "addEvent",
            payload: newCalendarEvent,
          });
        showReservationToast(singleReservation, room, mode);
      });
      if (mode === "edit") {
        const previousSingleReservations =
          recurrenceMap[recurrenceId].reservations;

        previousSingleReservations.forEach((singleReservation) =>
          dispatch({
            type: "removeEvent",
            payload: singleReservation.reservationId,
          })
        );
      }
    } catch (error) {
      showToast("Rezerwacja nieudana", {
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
        className="flex flex-col border min-h-[792px] px-6 py-6 gap-[6px] rounded-[8px]"
      >
        {/* pierwszy rzad */}
        <div className="flex justify-between items-center mb-2">
          <TypePicker type={type} setType={setType} />
          <div className={mode !== "edit" ? "flex-1 ml-4" : ""}>
            <InputTextBox
              label="Tytuł"
              placeholder="Wprowadź tytuł"
              icon={<Letter />}
              {...register("title", {
                required: "Tytuł jest wymagany",
                minLength: {
                  value: 3,
                  message: "Tytuł musi mieć przynajmniej 3 znaki",
                },
              })}
              error={methods.formState.errors.title?.message}
            />
          </div>

          {mode === "edit" && (
            <DeleteReservationButton
              reservationId={recurrenceId}
              reservationType={type}
              onFinishedEditing={onFinishedEditing}
              dispatch={dispatch}
              resetForm={() => reset(defaultValues)}
            />
          )}
        </div>
        {/* drugi rzad */}

        <div className="flex flex-row gap-2">
          <DatePicker field="startDate" />
          <DatePicker field="endDate" />
        </div>
        {/* trzeci rzad */}

        <div className="flex flex-row gap-2">
          <HourPicker start={true} />
          <HourPicker start={false} />
        </div>
        {/* czwarty rzad */}
        <div className="flex flex-row gap-2">
          <AtendeesPicker />
          {/* room picker */}
        </div>
        {/* equipment & software */}
        <FeaturesPicker />
        {/* rekurencyjne opcje */}
        <RecurringOptions />
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
            Cofnij
          </button>
        )}
      </form>
    </FormProvider>
  );
};

export default RecurringReservationForm;
