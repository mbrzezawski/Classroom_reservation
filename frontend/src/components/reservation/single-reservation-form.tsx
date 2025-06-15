import { useEffect, useState } from "react";
import type { Dispatch, FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type {
  // ReservationResponseDTO,
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
import ProposalForm, {type ProposalFormValues} from "./reserving/proposal-form";
import {usePostProposal} from "../../hooks/usePostProposal.ts";

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

  const roomsMap = useRoomsMap();
  const [allowChangeToReccuring, setAllowChangeToRecurring] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const { postProposal } = usePostProposal();

  const proposalMethods = useForm<ProposalFormValues>({
    defaultValues: {
      email: "",
      additionalDates: [
        {
          proposedDate: {
            date: "",
            startTime: "",
            endTime: ""
          }
        }
      ],
      comment: "",
    },
  });


  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const { register, handleSubmit, reset } = methods;
  const { getValues: getProposalValues } = proposalMethods;

  const mode = editedEvent ? "edit" : "create";
  const reservationId = editedEvent ? editedEvent.id : "";
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
      setAllowChangeToRecurring(false);
    } else {
      setAllowChangeToRecurring(true);
    }
  }, [editedEvent, type]);

  useEffect(() => {
    reset(editedEvent ? mapCalendarEventToSingleValues(editedEvent) : defaultValues);
  }, [editedEvent, reset]);

  const onSubmit = async (data: SingleReservationFormValues) => {
    setIsSubmitting(true);

    console.log("data on the start of onSubmit:", data);

    const isProposalMode =
        mode === "edit" &&
        showProposalForm &&
        getProposalValues().additionalDates.length >= 1;

    try {
      if (isProposalMode) {
        const proposal = getProposalValues();
        const reservationRequests = [
          {
            date: data.date,
            startTime: data.startHour,
            endTime: data.endHour,
            purpose: `${data.title} | ${proposal.comment}`,
            minCapacity: data.atendees,
            softwareIds: data.software,
            equipmentIds: data.equipment,
          },
          ...proposal.additionalDates.map((item) => ({
            date: item.proposedDate.date,
            startTime: item.proposedDate.startTime,
            endTime: item.proposedDate.endTime,
            purpose: `${data.title} | ${proposal.comment}`,
            minCapacity: data.atendees,
            softwareIds: data.software,
            equipmentIds: data.equipment,
          })),
        ];

        const proposalRequest = {
          studentEmail: proposal.email,
          originalReservationId: reservationId,
          reservationRequests,
          comment: proposal.comment,
        }

        // console.log("proposal comment:");
        // console.log(proposal.comment);
        // console.log("proposalRequests:");
        // console.log(proposalRequest);
        console.log("Proposal request:" , proposalRequest);

        const response = await postProposal(proposalRequest);
        console.log("Response from /proposals:", response);

        showToast("Proposal sent successfully!", { variant: "success" });
      } else {
        console.log("data durring single reservation:", data);
        const response = await submitSingleReservation(
            data,
            userId,
            token,
            mode,
            reservationId
        );

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
      }
    } catch (error) {
      showToast("Submission failed", {
        description:
            error instanceof Error ? error.message : "Unknown error",
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
          <div className="flex justify-between items-center mb-2">
            {allowChangeToReccuring && <TypePicker type={type} setType={setType} />}
            <div className={mode !== "edit" ? "flex-1 ml-4" : ""}>
              <InputTextBox
                  label="Title"
                  placeholder="Enter meeting title"
                  icon={<Letter />}
                  {...register("title", {
                    required: "Title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters long" },
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

          {mode === "edit" && (
              <label className="text-sm flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    onChange={(e) => setShowProposalForm(e.target.checked)}
                    checked={showProposalForm}
                />
                Send proposition of additional term
              </label>
          )}

          {showProposalForm && mode === "edit" && (
              <FormProvider {...proposalMethods}>
                <ProposalForm />
              </FormProvider>
          )}

          <FeaturesPicker />

          <button type="submit" className="btn rounded-[6px]" disabled={isSubmitting}>
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
