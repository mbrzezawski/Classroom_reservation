import type { FC } from "react";
import { useFormContext } from "react-hook-form";

const daysOfWeek = [
  { label: "Mon", value: "MONDAY" },
  { label: "Tue", value: "TUESDAY" },
  { label: "Wed", value: "WEDNESDAY" },
  { label: "Thu", value: "THURSDAY" },
  { label: "Fri", value: "FRIDAY" },
];

const RecurringOptions: FC = () => {
  const { register, watch } = useFormContext();
  const frequency = watch("frequency");

  return (
    <div className="flex flex-col gap-2 p-4 ">
      <div className="flex gap-2">
        <label className="flex flex-col text-xs">
          Frequency
          <select className="select" {...register("frequency", { required: true })}>
            <option value="DAILY">Daily</option>
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
            <span className="text-sm">Repeat on days:</span>
          {daysOfWeek.map((day) => (
            <label key={day.value} className="flex items-center gap-1 text-xs">
              <input
              type="checkbox"
              className="checkbox w-5 h-5"
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
    