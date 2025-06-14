import { useForm, useFieldArray } from "react-hook-form";
import InputTextBox from "../../ui/input-textbox";
import Delete from "../../icons/delete.tsx";
import Plus from "../../icons/plus.tsx";
import HourPicker from "./hour-picker.tsx";
import DatePicker from "./date-picker.tsx";

export type ProposalFormValues = {
    email: string;
    additionalDates: { date: string }[];
    comment: string;
};

const ProposalForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useForm<ProposalFormValues>({
        defaultValues: {
            email: "",
            additionalDates: [{ date: "" }],
            comment: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "additionalDates",
    });

    return (
        <>
            <InputTextBox
                icon={undefined}
                label="Starosta Email"
                placeholder="Enter email"
                error={errors.email?.message}
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                    },
                })}            />

            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                        <div className="flex flex-row gap-2 flex-1">
                            <DatePicker field={`additionalDates.${index}.date`} />
                            <HourPicker start={true} />
                            <HourPicker start={false} />
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
                                onClick={() => append({ date: "" })}
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
                label="Comment"
                placeholder="Enter your comment"
                error={errors.comment?.message}
                {...register("comment", {
                    required: "Comment is required",
                })}            />
        </>
    );
};

export default ProposalForm;
