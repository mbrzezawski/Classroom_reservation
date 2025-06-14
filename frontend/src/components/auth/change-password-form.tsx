import type { FC } from "react";
import PasswordTextBox from "./password-textbox";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";
import showToast from "../../hooks/show-toast";
import { API_URL } from "../../api";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  repeatedPassword: string;
};

const ChangePasswordForm: FC = () => {
  const methods = useForm({
    defaultValues: { oldPassword: "", newPassword: "", repeatedPassword: "" },
  });
  const onSubmit = (data: ChangePasswordFormValues) => {
    fetch(`${API_URL}/users/me/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to change password");
        }
        navigate("/main");
        showToast("Poprawnie zmieniono hasło", { variant: "success" });
      })
      .catch((error) => {
        console.log(error.message);
        showToast("Changing password failed", {
          description:
            error instanceof Error ? error.message : "Unknown error appeared",
          variant: "destructive",
        });
      });
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const password = watch("newPassword");
  const navigate = useNavigate();
  const { token } = useAuth();
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col border px-6 py-8 gap-[30px] rounded-[8px] "
      >
        <h2 className="text-[42px] text-center"> Change password</h2>
        <PasswordTextBox
          error={errors.oldPassword?.message}
          {...register("oldPassword", {
            required: "Old password is required",
          })}
        />
        <PasswordTextBox
          error={errors.newPassword?.message}
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 8,
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
            Change Password
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default ChangePasswordForm;
