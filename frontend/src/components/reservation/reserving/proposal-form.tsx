import { useFormContext, useFieldArray } from "react-hook-form";
import InputTextBox from "../../ui/input-textbox";
import Delete from "../../icons/delete.tsx";
import Plus from "../../icons/plus.tsx";
import HourPicker from "./hour-picker.tsx";
import DatePicker from "./date-picker.tsx";

export type proposedDate = {
  date: string;
  startTime: string;
  endTime: string;
};

export type ProposalFormValues = {
  email: string;
  additionalDates: { proposedDate: proposedDate }[];
  comment: string;
};

const ProposalForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalDates",
  });

  return (
    <>
      <InputTextBox
        icon={undefined}
        label="Email odbiorcy"
        placeholder="Wprowadź email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email jest wymagany",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Błędny format emaila",
          },
        })}
      />

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex flex-row gap-2 flex-1">
              <DatePicker
                field={`additionalDates.${index}.proposedDate.date`}
              />
              <HourPicker
                start={true}
                field={`additionalDates.${index}.proposedDate.startTime`}
              />
              <HourPicker
                start={false}
                field={`additionalDates.${index}.proposedDate.endTime`}
              />
            </div>

            {fields.length > 1 && index !== fields.length - 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center justify-center size-6 rounded mb-[8px]"
              >
                <Delete className="w-3 h-3" />
              </button>
            )}

            {index === fields.length - 1 && (
              <button
                type="button"
                onClick={() =>
                  append({
                    proposedDate: {
                      date: "",
                      startTime: "",
                      endTime: "",
                    },
                  })
                }
                className="flex items-center justify-center size-6 rounded mb-[8px]"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <InputTextBox
        icon={undefined}
        label="Komentarz"
        placeholder="Wprowadź komentarz"
        error={errors.comment?.message}
        {...register("comment")}
      />
    </>
  );
};

export default ProposalForm;
