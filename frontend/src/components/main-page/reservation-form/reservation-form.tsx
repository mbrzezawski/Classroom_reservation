import InputTextBox from "../../utils/input-textbox";
import Letter from "../../icons/letter";
import { meetingHours } from "../../../data/reservation/meeting-hours";
import { roomFeatures } from "../../../data/reservation/room-features";
import { FormProvider, useForm } from "react-hook-form";
type ReservationFormValues = {
  title: string;
  date: string; // ISO format: "2024-06-10"
  hour: string; // to jest godzina początkowa (zakladam ze zajecia zawsze trwaja 1,5h ale to mozna i tak latwo zmienic)
  repeats: string;
  atendees: number;
  features: string[];
};

const ReservationForm = () => {
  const methods = useForm({
    defaultValues: {
      title: "",
      date: "",
      hour: "",
      repeats: "None",
      atendees: 20,
      features: [],
    },
  });
  const onSubmit = (data: ReservationFormValues) => {
    console.log("Form submitted:", data);
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
        <div className="flex flex-row gap-2">
          <input
            type="date"
            className="input focus:outline-none"
            required
            {...register("date", { required: "Date is required" })}
          />
          <select
            className="select focus:outline-none"
            required
            defaultValue=""
            {...register("hour", { required: "Hour is required" })}
          >
            <option value="" disabled hidden>
              Pick an hour
            </option>
            {meetingHours.map((hour) => (
              <option key={hour.value} value={hour.value}>
                {hour.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[12px]">Repeats</label>
            <select
              className="select focus:outline-none"
              defaultValue="None"
              {...register("repeats")}
            >
              <option>None</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px]">Number of Attendees</label>
            <input
              type="number"
              className="input focus:outline-none"
              placeholder="Enter number"
              defaultValue=""
              min={1}
              {...register("atendees", {
                required: "Number of atendees is required",
              })}
            />
          </div>
        </div>
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
          <legend className="fieldset-legend">Additional features</legend>
          {roomFeatures.map((feature) => (
            <label className="label" key={feature.value}>
              <input
                type="checkbox"
                className="checkbox"
                value={feature.value}
                {...register("features")}
              />
              {feature.label}
            </label>
          ))}
        </fieldset>
        <button type="submit">Reserve</button>
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
