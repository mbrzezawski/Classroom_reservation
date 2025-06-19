import type { FC } from "react";
import { useFormContext } from "react-hook-form";

const daysOfWeek = [
  { label: "Pon", value: "MONDAY" },
  { label: "Wt", value: "TUESDAY" },
  { label: "Śr", value: "WEDNESDAY" },
  { label: "Czw", value: "THURSDAY" },
  { label: "Pt", value: "FRIDAY" },
];

const RecurringOptions: FC = () => {
  const { register, watch } = useFormContext();
  const frequency = watch("frequency");

  return (
    <div className="flex flex-col gap-2 p-4 ">
      <div className="flex gap-2">
        <label className="flex flex-col text-xs">
          Częstotliwość
          <select
            className="select focus:outline-none"
            {...register("frequency", { required: true })}
          >
            <option value="DAILY">Dziennie</option>
            <option value="WEEKLY">Tygodniowo</option>
            <option value="MONTHLY">Miesięcznie</option>
          </select>
        </label>

        <label className="flex flex-col text-xs">
          Odstęp
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
          <span className="text-sm">W dniach:</span>
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
          <label className="text-xs">
            Dni miesiąca (przedzielone przecinkiem):
            <br />
            <input
              type="text"
              className="input"
              placeholder="np.: 1,15,28"
              {...register("byMonthDays")}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default RecurringOptions;
