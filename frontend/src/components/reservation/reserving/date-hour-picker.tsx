import type { FC } from "react";
import { meetingHours } from "../../../data/reservation/meeting-hours";
import { useFormContext } from "react-hook-form";
const DateHourPicker: FC = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col flex-1">
        <label className="text-xs font-medium mb-1" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="input focus:outline-none"
          required
            {...register("date", {
            validate: (value, formValues) =>
              formValues?.type === "single"
              ? !!value || "Date is required"
              : true,
            })}
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-xs font-medium mb-1" htmlFor="startHour">
          Hour
        </label>
        <select
          id="startHour"
          className="select focus:outline-none"
          required
          defaultValue=""
          {...register("startHour", { required: "Hour is required" })}
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
    </div>
  );
};
export default DateHourPicker;