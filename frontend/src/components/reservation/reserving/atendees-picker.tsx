import type React from "react";
import { useFormContext } from "react-hook-form";

const AtendeesPicker: React.FC = () => {
  const { register } = useFormContext();
  return (
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
  );
};

export default AtendeesPicker;
