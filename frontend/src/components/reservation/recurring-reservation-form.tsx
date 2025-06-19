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
import { mapCalendarEventToRecurringValues } from "../../utils/reserving-mapping.ts";
import type { Room } from "../../types/room.ts";
import type { FullCalendarEvent } from "../../types/calendar-event.ts";
import { showReservationToast } from "../../utils/show-reservation-toast.ts";
import RecurringProposalForm, {
  type RecurringProposalFormValues,
} from "./reserving/recurring-proposal-form.tsx";
import { usePostProposal } from "../../hooks/usePostProposal.ts";

interface Props {
  userId: string;
  role: string;
  dispatch: Dispatch<Action>;
  type: ReservationType;
  setType: (type: ReservationType) => void;
  editedEvent: FullCalendarEvent | null;
  onFinishedEditing: () => void;
  onFinishedRequest: () => void;
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
  onFinishedRequest,
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
  const [showProposalForm, setShowProposalForm] = useState(false);
  const { postProposal } = usePostProposal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const mode = editedEvent ? "edit" : "create";
  const recurrenceId =
    editedEvent && editedEvent.extendedProps.recurrenceProps
      ? editedEvent.extendedProps.recurrenceProps?.recurrenceId
      : "";

  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Rezerwuję..."
      : "Zapisuję..."
    : mode === "create"
    ? "Zarezerwuj"
    : "Zapisz zmiany";

  const recurringProposalMethods = useForm<RecurringProposalFormValues>({
    defaultValues: {
      email: "",
      comment: "",
      additionalDates: [
        {
          RecurringProposedDate: {
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            frequency: "DAILY",
            interval: 1,
            byDays: [], // empty array for WEEKLY option
            byMonthDays: "", // empty string for MONTHLY option
          },
        },
      ],
    },
  });

  const { getValues: getProposalValues } = recurringProposalMethods;

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

    const isProposalMode =
      mode === "edit" &&
      showProposalForm &&
      getProposalValues().additionalDates.length >= 1;

    try {
      if (isProposalMode) {
        const proposal = getProposalValues();
        const recurringRequests = [
          {
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startHour,
            endTime: data.endHour,
            purpose: `${data.title} | ${proposal.comment}`,
            minCapacity: data.atendees,
            softwareIds: data.software,
            equipmentIds: data.equipment,
            frequency: data.frequency,
            interval: data.interval,
            byDays: data.byDays,
          },
          ...proposal.additionalDates.map((item) => ({
            startDate: item.RecurringProposedDate.startDate,
            endDate: item.RecurringProposedDate.endDate,
            startTime: item.RecurringProposedDate.startTime,
            endTime: item.RecurringProposedDate.endTime,
            purpose: `${data.title} | ${proposal.comment}`,
            minCapacity: data.atendees,
            softwareIds: data.software,
            equipmentIds: data.equipment,
            frequency: item.RecurringProposedDate.frequency,
            interval: item.RecurringProposedDate.interval,
            byDays: item.RecurringProposedDate.byDays,
          })),
        ];

        const request = {
          studentEmail: proposal.email,
          originalRecurrenceId: recurrenceId,
          recurringRequests,
          comment: proposal.comment,
        };

        const response = await postProposal(request);
        if (response.ok)
          showToast("Propozycja wysłana!", { variant: "success" });
      } else {
        let response: RecurringReservationResponseDTO;
        response = await submitRecurringReservation(
          data,
          userId,
          token,
          mode,
          recurrenceId
        );
        const room: Room = roomsMap[response.roomId];

        response.reservations.forEach((singleReservation) => {
          showReservationToast(singleReservation, room, mode);
        });
      }
    } catch (error) {
      showToast("Rezerwacja nieudana", {
        description:
          error instanceof Error ? error.message : "Unknown error appeared",
        variant: "destructive",
      });
    } finally {
      await onFinishedRequest();
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
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
              resetForm={() => reset(defaultValues)}
              onFinishedRequest={onFinishedRequest}
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

        <div className="flex flex-col gap-2 mb-4">
          {mode === "edit" && (
            <label className="text-sm flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => setShowProposalForm(e.target.checked)}
                checked={showProposalForm}
              />
              Wyślij jako propozycję innej osobie
            </label>
          )}

          {showProposalForm && mode === "edit" && (
            <FormProvider {...recurringProposalMethods}>
              <RecurringProposalForm />
            </FormProvider>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary rounded-[6px]"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            className="btn btn-neutral rounded-[6px]"
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
