import React from "react";
import { useFormContext } from "react-hook-form";

interface HourPickerProps {
    start: boolean;
    field?: string;
    min?: string;
    max?: string;
}

const HourPicker: React.FC<HourPickerProps> = ({
                                                   start = true,
                                                   field,
                                                   min = "00:00",
                                                   max = "23:45",
                                               }) => {
    const { register } = useFormContext();

    const fallbackField = start ? "startHour" : "endHour";
    const fieldName = field ?? fallbackField;
    const label = start ? "Start hour" : "End hour";
    const message = start ? "Starting hour is required" : "Ending hour is required";

    return (
        <div className="flex flex-col flex-1">
            <label className="text-xs font-medium mb-1">{label}</label>
            <input
                type="time"
                className="input"
                step={300}
                min={min}
                max={max}
                required
                {...register(fieldName, { required: message })}
            />
        </div>
    );
};


export default HourPicker;