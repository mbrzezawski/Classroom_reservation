import type React from "react";
import { useFormContext } from "react-hook-form";

const AtendeesPicker: React.FC = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px]">Liczba uczestników</label>
      <input
        type="number"
        className="input focus:outline-none"
        placeholder="Wprowadź liczbę"
        defaultValue=""
        min={1}
        {...register("atendees", {
          required: "Pole jest wymagane",
        })}
      />
    </div>
  );
};

export default AtendeesPicker;
