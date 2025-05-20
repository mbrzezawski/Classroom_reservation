import type { FC } from "react";
import { useFormContext } from "react-hook-form";

const RepeatsAtendeesPicker: FC = () => {
  const { register } = useFormContext();
  return (
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
  );
};

export default RepeatsAtendeesPicker;
