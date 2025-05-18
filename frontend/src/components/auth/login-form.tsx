import { FormProvider, useForm } from "react-hook-form";
import InputTextBox from "../utils/input-textbox";
import PasswordTextBox from "./password-textbox";
import AtIcon from "../icons/at";
import { useNavigate } from "react-router-dom";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const methods = useForm({
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = (data: LoginFormValues) => {
    console.log("Form submitted:", data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px]"
      >
        <h2 className="text-[42px] text-center">Login</h2>

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

        <div className="flex flex-col gap-1 items-end">
          <div className="w-full">
            <PasswordTextBox
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />
          </div>
          <button
            type="button"
            className="btn-link no-underline cursor-pointer text-[12px]"
          >
            Forgot password?
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn w-[274px] py-2 border rounded-[12px]"
          >
            Login
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-center">Don't have an account?</p>
          <button
            type="button"
            className="flex self-center btn-link no-underline cursor-pointer text-[12px] font-bold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
