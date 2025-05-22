import InputTextBox from "../utils/input-textbox";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./reserving/date-hour-picker";
import RepeatsAtendeesPicker from "./reserving/repeats-atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import { postReservation } from "./reserving/post-reservation";
import {useState} from "react";
import {useToast} from "../../hooks/use-toast.ts";

export type ReservationFormValues = {
  title: string;
  date: string; // ISO format: "2024-06-10"
  hour: string; // to jest godzina początkowa (zakladam ze zajecia zawsze trwaja 1,5h ale to mozna i tak latwo zmienic)
  repeats: string;
  atendees: number;
  equipment: string[];
  software: string[];
};

const ReservationForm = () => {
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

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await postReservation(data);
      const startTime = data.hour;
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHours = hours + Math.floor((minutes + 90) / 60);
      const endMinutes = (minutes + 90) % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      toast("Booking succed", {
        description: `Sala ${response.roomName} zarezerwowana na ${data.date} ${startTime}-${endTime}`,
        variant: "success"
      });


      methods.reset();
    } catch (error) {
      toast("Booking failed", {
        description: error instanceof Error ? error.message : "Wystąpił nieznany błąd",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <FormProvider {...methods}>
        <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px]"
        >
          <h2 className="text-xl font-bold">Nowa rezerwacja</h2>

          <InputTextBox
              label="Tytuł spotkania"
              placeholder="Wprowadź tytuł spotkania"
              icon={<Letter />}
              {...methods.register("title", {
                required: "Tytuł jest wymagany",
                minLength: {
                  value: 3,
                  message: "Tytuł musi mieć przynajmniej 3 znaki"
                }
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
            {isSubmitting ? "Rezerwowanie..." : "Zarezerwuj"}
          </button>
        </form>
      </FormProvider>
  );
};


export default ReservationForm;
