import InputTextBox from "../utils/input-textbox";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./reserving/date-hour-picker";
import RepeatsAtendeesPicker from "./reserving/repeats-atendees-picker";
import FeaturesPicker from "./reserving/features-picker";
import { postReservation } from "./reserving/post-reservation";

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
  const onSubmit = (data: ReservationFormValues) => postReservation(data)
  const { register, handleSubmit } = methods;
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px]"
      >
        <InputTextBox
          label="Title"
          placeholder="Enter meeting title"
          icon={<Letter />}
          {...register("title", { required: "Title is required" })}
        ></InputTextBox>
        <DateHourPicker />
        <RepeatsAtendeesPicker />
        <FeaturesPicker />
        <button type="submit" className="btn rounded-[6px]">
          Reserve
        </button>
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
