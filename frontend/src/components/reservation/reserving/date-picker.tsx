import React from "react";
import { useFormContext } from "react-hook-form";

interface DatePickerProps {
  field: "date" | "startDate" | "endDate";
}

const DatePicker: React.FC<DatePickerProps> = ({ field = "date" }) => {
  const { register } = useFormContext();
  let label = "";
  if (field === "date") label = "Data";
  else if (field === "startDate") label = "Data początkowa";
  else label = "Data końcowa";

  return (
    <div className="flex flex-col flex-1">
      <label className="text-xs font-medium mb-1" htmlFor={field}>
        {label}
      </label>
      <input
        id={field}
        type="date"
        className="input focus:outline-none"
        required
        {...register(field, { required: `${label} jest wymagana` })}
      />
    </div>
  );
};

export default DatePicker;
