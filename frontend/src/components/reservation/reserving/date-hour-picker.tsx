import type { FC } from "react";
import { meetingHours } from "../../../data/reservation/meeting-hours";
import { useFormContext } from "react-hook-form";
const DateHourPicker: FC = () => {
  const { register } = useFormContext();
  return (
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
  );
};
export default DateHourPicker;
