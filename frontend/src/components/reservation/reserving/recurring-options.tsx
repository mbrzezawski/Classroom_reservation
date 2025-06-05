import type { FC } from "react";
import { useFormContext } from "react-hook-form";

const daysOfWeek = [
  { label: "Mon", value: "MONDAY" },
  { label: "Tue", value: "TUESDAY" },
  { label: "Wed", value: "WEDNESDAY" },
  { label: "Thu", value: "THURSDAY" },
  { label: "Fri", value: "FRIDAY" },
  { label: "Sat", value: "SATURDAY" },
  { label: "Sun", value: "SUNDAY" },
];

const RecurringOptions: FC = () => {
  const { register, watch } = useFormContext();
  const frequency = watch("frequency");

  return (
    <div className="flex flex-col gap-2 p-4 ">
      <div className="flex gap-2 w-full">
        <label className="flex flex-col text-xs flex-1">
          Start date
          <input
            type="date"
            className="input"
            {...register("startDate", { required: "Start date is required" })}
          />
        </label>
        <label className="flex flex-col text-xs flex-1">
          End date
          <input
            type="date"
            className="input"
            {...register("endDate", { required: "End date is required" })}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <label className="flex flex-col text-xs">
          Frequency
          <select className="select" {...register("frequency", { required: true })}>
            <option value="DAILY" selected>Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </label>

        <label className="flex flex-col text-xs">
          Interval
          <input
            type="number"
            className="input"
            min={1}
            defaultValue={1}
            {...register("interval", { required: true, min: 1 })}
          />
        </label>
      </div>

      {frequency === "WEEKLY" && (
        <div className="flex flex-wrap gap-2">
          <span className="font-medium text-sm">Repeat on days:</span>
          {daysOfWeek.map((day) => (
            <label key={day.value} className="flex items-center gap-1">
              <input
                type="checkbox"
                className="checkbox"
                value={day.value}
                {...register("byDays")}
              />
              {day.label}
            </label>
          ))}
        </div>
      )}

      {frequency === "MONTHLY" && (
        <div className="flex flex-col gap-2">
          <label>
            Month days (comma separated):<br />
            <input
              type="text"
              className="input"
              placeholder="e.g. 1,15,28"
              {...register("byMonthDays")}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default RecurringOptions;
    