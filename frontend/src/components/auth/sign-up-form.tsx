import type { FC } from "react";
import InputTextBox from "./input-textbox";
import AtIcon from "../icons/at";
import PasswordTextBox from "./password-textbox";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type SignUpFormValues = {
  email: string;
  password: string;
  repeatedPassword: string;
};

const SignUpForm: FC = () => {
  const methods = useForm({
    defaultValues: { email: "", password: "", repeatedPassword: "" },
  });
  const onSubmit = (data: SignUpFormValues) => {
    console.log("Form submitted:", data);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const password = watch("password");
  const navigate = useNavigate();
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px] "
      >
        <h2 className="text-[42px] text-center">Sign up</h2>
        <InputTextBox
          label="Email"
          type="email"
          placeholder="Type your email"
          icon={<AtIcon />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
        />
        <PasswordTextBox
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        <PasswordTextBox
          confirmPassword={true}
          error={errors.repeatedPassword?.message}
          {...register("repeatedPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn w-[274px] py-2 border rounded-[12px]"
          >
            Sign up
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-center">Already have an account?</p>
          <button
            type="button"
            className="flex self-center btn-link no-underline cursor-pointer text-[12px] font-bold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default SignUpForm;
