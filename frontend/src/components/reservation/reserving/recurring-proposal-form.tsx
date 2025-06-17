import type {ProposalFormValues, proposedDate} from "./proposal-form.tsx";
import {useFieldArray, useForm, useFormContext} from "react-hook-form";
// import RecurringOptions from "./reserving/recurring-options.tsx";
import InputTextBox from "../../ui/input-textbox.tsx";
import DatePicker from "./date-picker.tsx";
import HourPicker from "./hour-picker.tsx";
import Delete from "../../icons/delete.tsx";
import Plus from "../../icons/plus.tsx";
import {useEffect} from "react";
import RecurringOptions from "./recurring-options.tsx";

export type RecurringProposedDates = {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    interval: number;
    byDays?: string[];         // tylko jeśli WEEKLY
    byMonthDays?: string;      // tylko jeśli MONTHLY
}


export type RecurringProposalFormValues = {
    email: string;
    additionalDates: { RecurringProposedDate: RecurringProposedDates }[];
    comment: string;
};

const RecurringProposalForm = () => {


    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<RecurringProposalFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "additionalDates",
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({
                RecurringProposedDate: {
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    frequency: "DAILY",
                    interval: 1,
                    byDays: [],
                    byMonthDays: "",
                },
            });
        }
    }, [fields, append]);



    return(
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
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex flex-row gap-2">
                            <DatePicker
                                field={`additionalDates.${index}.RecurringProposedDate.startDate`}
                            />
                            <DatePicker
                                field={`additionalDates.${index}.RecurringProposedDate.endDate`}
                            />
                            </div>
                            <div className="flex flex-row gap-2">
                            <HourPicker
                                start={true}
                                field={`additionalDates.${index}.RecurringProposedDate.startTime`}
                            />
                            <HourPicker
                                start={false}
                                field={`additionalDates.${index}.RecurringProposedDate.endTime`}
                            />
                            </div>
                            <RecurringOptions
                                fieldPrefix={`additionalDates.${index}.RecurringProposedDate`}
                            />

                        </div>

                        {fields.length > 1 && index !== fields.length - 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="flex items-center justify-center size-6 rounded mb-[8px]"
                            >
                                <Delete className="w-3 h-3"/>
                            </button>
                        )}

                        {index === fields.length - 1 && (
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        RecurringProposedDate: {
                                            startDate: "",
                                            endDate: "",
                                            startTime: "",
                                            endTime: "",
                                            frequency: "DAILY",
                                            interval: 1,
                                            byDays: [],
                                            byMonthDays: "",
                                        },
                                    })
                                }
                                className="flex items-center justify-center size-6 rounded mb-[8px]"
                            >
                                <Plus className="w-3 h-3"/>
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


    )
}


export default RecurringProposalForm;