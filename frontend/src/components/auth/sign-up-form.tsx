import { type FC, useEffect, useState } from "react";
import InputTextBox from "../ui/input-textbox";
import AtIcon from "../icons/at";
import PasswordTextBox from "./password-textbox";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { API_URL } from "../../api.ts";
import showToast from "../../hooks/show-toast.ts";
type SignUpFormValues = {
  email: string;
  password: string;
  repeatedPassword: string;
  name: string;
  surname: string;
  specialCode: string;
};

const SignUpForm: FC = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      repeatedPassword: "",
      name: "",
      surname: "",
      specialCode: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Form submitted:", data);
    const adminCode = "ADMIN_CODE";
    const deansCode = "DEANS_CODE";
    const body = {
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
      adminCode: data.specialCode === adminCode ? adminCode : "",
      deansCode: data.specialCode === deansCode ? deansCode : "",
    };
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas rejestracji");
      }

      navigate("/login");
      showToast("Link z potwierdzeniem został wysłany na maila!", {
        variant: "success",
      });
    } catch (err: any) {
      console.error("Błąd przy rejestracji:", err.message);
      alert(err.message);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const password = watch("password");
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    if (showCodeInput == false) {
      setValue("specialCode", "");
    }
  }, [showCodeInput]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-200 px-6 py-8 gap-8 rounded-[8px] shadow-xs w-[400px] max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center">Załóż konto</h2>

        <div className="flex flex-col gap-4 flex-1">
          <InputTextBox
            label="Imię"
            type="text"
            placeholder="Napisz swoje imię"
            icon={undefined}
            error={errors.name?.message}
            {...register("name", {
              required: "Imię jest wymagane",
            })}
          />
          <InputTextBox
            label="Nazwisko"
            type="text"
            placeholder="Napisz swoje nazwisko"
            icon={undefined}
            error={errors.surname?.message}
            {...register("surname", {
              required: "Nazwisko jest wymagane",
            })}
          />
          <InputTextBox
            label="Email"
            type="email"
            placeholder="Wpisz email"
            icon={<AtIcon />}
            error={errors.email?.message}
            {...register("email", {
              required: "Email jest wymagany",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Niepoprawny format emaila",
              },
            })}
          />
          <PasswordTextBox
            error={errors.password?.message}
            {...register("password", {
              required: "Hasło jest wymagane",
              minLength: {
                value: 6,
                message: "Hasło musi mieć co najmniej 6 znaków",
              },
            })}
          />
          <PasswordTextBox
            confirmPassword={true}
            error={errors.repeatedPassword?.message}
            {...register("repeatedPassword", {
              required: "Powtórz hasło",
              validate: (value) =>
                value === password || "Hasła nie są takie same",
            })}
          />

          <div className="flex flex-row gap-4 flex-1">
            <label className="text-sm flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => setShowCodeInput(e.target.checked)}
                checked={showCodeInput}
              />
              Mam kod specjalny
            </label>

            {showCodeInput && (
              <InputTextBox
                label={""}
                icon={undefined}
                type="code"
                placeholder="Wpisz kod specjalny"
                error={errors.specialCode?.message}
                {...register("specialCode")}
              />
            )}
          </div>
        </div>

        {/* Przycisk */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="btn btn-primary w-[274px] py-2 border rounded-[12px]"
          >
            Załóż konto
          </button>
        </div>

        {/* Link do logowania */}
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-center">Masz już konto?</p>
          <button
            type="button"
            className="flex self-center btn-link no-underline cursor-pointer text-[12px] font-bold hover:underline"
            onClick={() => navigate(`/login`)}
          >
            Zaloguj się
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default SignUpForm;
