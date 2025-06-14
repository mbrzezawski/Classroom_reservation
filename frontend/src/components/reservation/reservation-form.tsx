import InputTextBox from "../ui/input-textbox.tsx";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import FeaturesPicker from "./reserving/features-picker";
import submitReservation from "./reserving/submit-reservation.ts";
import { useEffect, useState, type Dispatch, type FC } from "react";
import showToast from "../../hooks/show-toast.ts";
import type { Action } from "../../store/events-reducer.ts";
import { useRoomsMap } from "../../hooks/use-rooms-map.tsx";
import type { Room } from "../../types/room.ts";
import type {
  EditableReservation,
  RecurringReservationResponseDTO,
  ReservationFormValues,
  ReservationResponseDTO,
} from "../../types/reservations.ts";
import DeleteReservationButton from "./reserving/delete-reservation-button.tsx";
import RecurringOptions from "./reserving/recurring-options.tsx";
import { RoleType } from "../../types/user-role.ts";
import { useAuth } from "../../auth/auth-context";
import DatePicker from "./reserving/date-picker.tsx";
import HourPicker from "./reserving/hour-picker.tsx";
import AtendeesPicker from "./reserving/atendees-picker.tsx";
import RoomPicker from "./reserving/room-picker.tsx";

interface ReservationFormProps {
  userId: string;
  role: RoleType;
  dispatch: Dispatch<Action>;
  mode: "create" | "edit";
  onFinishedEditing: () => void;
  reservationId?: string;
  editValues?: EditableReservation | null;
}

const defaultValues: ReservationFormValues = {
  type: "single",
  title: "",
  date: "",
  startHour: "",
  endHour: "",
  atendees: 0,
  equipment: [],
  software: [],
  roomId: "",

  startDate: "",
  endDate: "",
  frequency: undefined,
  interval: undefined,
  byDays: [],
  byMonthDays: [],
};

const ReservationForm: FC<ReservationFormProps> = ({
  userId,
  role,
  dispatch,
  mode,
  onFinishedEditing,
  reservationId,
  editValues,
}) => {
  const { token } = useAuth();
  if (!token) return;
  const methods = useForm({
    defaultValues: editValues || defaultValues,
  });
  const { register, handleSubmit, reset, watch } = methods;
  const type = watch("type");

  useEffect(() => {
    if (mode === "edit" && editValues) {
      console.log(editValues)
      reset(editValues);
    }
  }, [mode, editValues, reset]);

  const roomsMap = useRoomsMap();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Booking..."
      : "Saving..."
    : mode === "create"
    ? "Book"
    : "Save changes";

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      let response: ReservationResponseDTO | RecurringReservationResponseDTO;

      response = await submitReservation(
        data,
        userId,
        token,
        mode,
        reservationId
      );

      const room: Room = roomsMap[response.roomId];
      // Check if response is RecurringReservationResponseDTO (has reservations array)
      const singleReservationList =
        "reservations" in response ? response.reservations : [response];

      singleReservationList.forEach((singleReservation) => {
        
        const startTime = singleReservation.start
        const endTime = singleReservation.end
        showToast(
          mode === "create" ? "Booking succeeded" : "Reservation updated",
          {
            description: `Room ${room.name} (${room.location}) ${
              mode === "create" ? "booked" : "updated"
            } for  
            ${startTime.slice(0, 5)}-${endTime
              .slice(0, 5)} ${data.date}`,
            variant: "success",
          }
        );
        const newEvent = {
          id: singleReservation.reservationId,
          title: data.title,
          start: startTime,
          end: endTime,
          extendedProps: {
            roomName: room.name,
            roomLocation: room.location,
            atendees: data.atendees,
            equipment: data.equipment,
            software: data.software,
            roomId: data.roomId,
          },
        };

        if (mode === "edit") {
          dispatch({
            type: "updateEvent",
            payload: { oldId: reservationId!, newEvent },
          });
          onFinishedEditing();
        } else dispatch({ type: "addEvent", payload: newEvent });
      });

      reset(defaultValues);
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
        className="flex flex-col border px-6 py-8 gap-[8px] rounded-[8px]"
      >
        {/* pierwszy rzad */}
        <div className="flex justify-between items-center mb-2">
          {mode == "create" && (
            <div className="flex flex-col gap-2">
              <label className="font-medium text-xs">Reservation type</label>
              <select
                className="select"
                {...register("type", { required: true })}
              >
                <option value="single">Single</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
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
              reservationId={reservationId!}
              onFinishedEditing={onFinishedEditing}
              dispatch={dispatch}
              resetForm={() => reset(defaultValues)}
            />
          )}
        </div>
        {/* drugi rzad */}
        {type === "single" &&(
          <div className="flex flex-row gap-2">
              <DatePicker field="date" />
              <HourPicker start={true}/>
          </div>
        )}
        {type === "recurring" && (         
          <div className="flex flex-row gap-2">
            <DatePicker field="startDate" />
            <DatePicker field="endDate" />
          </div>
        )}
        {/* trzeci rzad */}
        {type === "single" && (
          <div className="flex flex-row gap-2">
            <AtendeesPicker />
            <HourPicker start={false}/>
          </div>
        )}
        {type === "recurring" && (
          <div className="flex flex-row gap-2">
            <HourPicker start={true}/>
            <HourPicker start={false}/>
          </div>
        )}
        {/* czwarty rzad */}
        {type === "recurring" && (
          <div className="flex flex-row gap-2">
            <AtendeesPicker/>
            {role===RoleType.DEANS_OFFICE && (
              <RoomPicker roomsMap={roomsMap}/>
            )}
          </div>
        )}
        {/* <DateHourPicker type={methods.watch("type")} />
        <RoomAtendeesPicker roomsMap={roomsMap} role={role} /> */}
        {/* equipment & software */}
        <FeaturesPicker />
        {/* rekurencyjne opcje */}
        {type === "recurring" && <RecurringOptions />}
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
