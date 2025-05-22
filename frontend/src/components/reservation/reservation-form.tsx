import InputTextBox from "../utils/input-textbox";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./reserving/date-hour-picker";
import RepeatsAtendeesPicker from "./reserving/repeats-atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import { postReservation } from "./reserving/post-reservation";
import { useState, type FC } from "react";
import { useToast } from "../../hooks/use-toast.ts";

export type ReservationFormValues = {
  title: string;
  date: string; // ISO format: "2024-06-10"
  hour: string; // HH:MM to jest godzina początkowa (zakladam ze zajecia zawsze trwaja 1,5h ale to mozna i tak latwo zmienic)
  repeats: string;
  atendees: number;
  equipment: string[];
  software: string[];
};

interface ReservationFormProps {
  userId: string;
}

const ReservationForm: FC<ReservationFormProps> = ({ userId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const methods = useForm({
    defaultValues: {
      title: "",
      date: "",
      hour: "",
      repeats: "None",
      atendees: 20,
      equipment: [],
      software: [],
    },
  });

  const { register, handleSubmit, reset } = methods;

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await postReservation(data, userId);
      console.log("response body: ", response);
      const [year, month, day] = data.date.split("-").map(Number);
      const startHour = data.hour;
      const [hours, minutes] = startHour.split(":").map(Number);
      const startTime = new Date(year, month - 1, day, hours, minutes)
        .toTimeString()
        .slice(0, 5);
      const endTime = new Date(year, month - 1, day, hours, minutes + 90)
        .toTimeString()
        .slice(0, 5);

      toast("Booking succed", {
        description: `Room ${
          response.message.split(":")[1]
        } booked for  ${startTime}-${endTime} ${data.date}`,
        variant: "success",
      });

      reset();
    } catch (error) {
      toast("Booking failed", {
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
        <h2 className="text-xl font-bold">Nowa rezerwacja</h2>

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
