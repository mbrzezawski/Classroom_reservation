import InputTextBox from "../utils/input-textbox";
import Letter from "../icons/letter";
import { FormProvider, useForm } from "react-hook-form";
import DateHourPicker from "./date-hour-picker";
import RepeatsAtendeesPicker from "./repeats-atendees-picker";
import FeaturesPicker from "./features-picker";
type ReservationFormValues = {
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
  const onSubmit = (data: ReservationFormValues) => {
    const startHour = data.hour;
    const [hours, minutes] = startHour.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes + 90);
    const endHour = endTime.toTimeString().slice(0, 5);
    const body = {
      userId: "1234",
      date: data.date,
      startTime: startHour,
      endTime: endHour,
      purpose: data.title,
      minCapacity: data.atendees,
      softwareIds: data.software,
      equipmentIds: data.equipment,
    };
    console.log(body);
    fetch("http://localhost:8080/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };
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
