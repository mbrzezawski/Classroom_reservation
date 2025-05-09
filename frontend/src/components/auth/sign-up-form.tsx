// import type { FC } from "react";
// import TextBox from "./input-textbox";
// import AtIcon from "../icons/at";
// import PasswordTextBox from "./password-textbox";

// const SignUpForm: FC = () => {
//   return (
//     <form className="flex flex-col border *:px-6 py-8 gap-[30px] rounded-[8px] ">
//       <h2 className="text-[42px] text-center">Sign up</h2>
//       <TextBox
//         label="Email"
//         type="email"
//         placeholder="Type your email"
//         icon={<AtIcon></AtIcon>}
//       />
//       <PasswordTextBox />
//       <PasswordTextBox confirmPassword={true} />
//       <div className="flex justify-center">
//         <button
//           type="submit"
//           className="btn w-[274px] py-2 border rounded-[12px]"
//         >
//           Sign up
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SignUpForm;

import { useForm } from "react-hook-form";
import TextBox from "./input-textbox";
import PasswordTextBox from "./password-textbox";
import AtIcon from "../icons/at";

type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Sign up data:", data);
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col border *:px-6 py-8 gap-[30px] rounded-[8px]"
    >
      <h2 className="text-[42px] text-center">Sign up</h2>

      <div>
        <TextBox
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
      </div>

      <div>
        <PasswordTextBox
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
      </div>

      <div>
        <PasswordTextBox
          confirmPassword
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please repeat your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="btn w-[274px] py-2 border rounded-[12px]"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
