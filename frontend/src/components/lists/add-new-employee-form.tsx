import { FormProvider, useForm } from "react-hook-form";
import InputTextBox from "../ui/input-textbox";
import { useState } from "react";

type Role = "EMPLOYEE" | "MANAGER" | "ADMIN" | "DEANS_OFFICE";

type NewUserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
};

const AddUserForm = () => {
    const methods = useForm<NewUserFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "EMPLOYEE",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const [submittedData, setSubmittedData] = useState<NewUserFormValues | null>(null);

    const onSubmit = (data: NewUserFormValues) => {
        setSubmittedData(data);
        console.log("New user added:", data);
        methods.reset();       // TODO: implement communication with backend
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px] w-full max-w-lg mx-auto"
            >
                <h2 className="text-[32px] text-center font-semibold">Add New User</h2>

                <InputTextBox
                    label="First Name"
                    placeholder="Enter first name"
                    error={errors.firstName?.message}
                    {...register("firstName", { required: "First name is required" })}
                />

                <InputTextBox
                    label="Last Name"
                    placeholder="Enter last name"
                    error={errors.lastName?.message}
                    {...register("lastName", { required: "Last name is required" })}
                />

                <InputTextBox
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                        },
                    })}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                        {...register("role", { required: "Role is required" })}
                        className="select select-bordered w-full"
                    >
                        <option value="TEACHER">Didactic Employee</option>
                        <option value="STUDENT">Authorized Student</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DEANS_OFFICE">Dean's Office</option>
                    </select>
                    {errors.role && <p className="text-sm">{errors.role.message}</p>}
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="btn w-[274px] py-2 border rounded-[12px]">
                        Add User
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default AddUserForm;
