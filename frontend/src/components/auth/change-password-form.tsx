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
          throw new Error(error.error || "");
        }
        navigate("/main");
        showToast("Poprawnie zmieniono hasło", { variant: "success" });
      })
      .catch((error) => {
        showToast("Nie udało się zmienić hasła", {
          description: error instanceof Error ? error.message : "",
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
        className="flex flex-col bg-base-200 border border-base-300 shadow-lg w-[380px]  px-6 py-8 gap-[30px] rounded-[8px]"
      >
        <h2 className="text-3xl font-bold text-center">Zmień hasło</h2>
        <PasswordTextBox
          error={errors.oldPassword?.message}
          {...register("oldPassword", {
            required: "Poprzednie hasło jest wymagane",
          })}
        />
        <PasswordTextBox
          error={errors.newPassword?.message}
          {...register("newPassword", {
            required: "Nowe hasło jest wymagane",
            minLength: {
              value: 8,
              message: "Hasło musi mieć przynajmniej 8 znaków",
            },
          })}
        />
        <PasswordTextBox
          confirmPassword={true}
          error={errors.repeatedPassword?.message}
          {...register("repeatedPassword", {
            required: "Proszę powtórzyć hasło",
            validate: (value) => value === password || "Hasła się różnią",
          })}
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary w-[274px] py-2 rounded-xl shadow-md"
          >
            Zmień hasło
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default ChangePasswordForm;
