import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputTextBox from "../ui/input-textbox";
import PasswordTextBox from "./password-textbox";
import AtIcon from "../icons/at";
import { API_URL } from "../../api";

type SignUpFormValues = {
  email: string;
  password: string;
  repeatedPassword: string;
  name: string;
  surname: string;
  specialCode: string;
};

const SignUpForm: React.FC = () => {
  const methods = useForm<SignUpFormValues>({
    defaultValues: { email: "", password: "", repeatedPassword: "", name: "", surname: "", specialCode: "" },
  });

  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const password = methods.watch("password");

  useEffect(() => {
    if (!showCodeInput) {
      methods.setValue("specialCode", "");
    }
  }, [showCodeInput, methods]);

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

      // Show confirmation popup instead of direct navigation
      setShowModal(true);
    } catch (err: any) {
      console.error("Błąd przy rejestracji:", err.message);
      alert(err.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-200 border border-base-300 shadow-lg w-[380px] px-6 py-8 gap-[30px] rounded-[8px]"
      >
        <h2 className="text-3xl font-bold text-center">Załóż konto</h2>

        <InputTextBox
          label="Imię"
          type="text"
          icon={undefined}
          placeholder="Wpisz imię"
          error={errors.name?.message}
          {...register("name", { required: "Imię jest wymagane" })}
        />
        <InputTextBox
          label="Nazwisko"
          type="text"
          icon={undefined}
          placeholder="Wpisz nazwisko"
          error={errors.surname?.message}
          {...register("surname", { required: "Nazwisko jest wymagane" })}
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
              message: "Nieprawidłowy format",
            },
          })}
        />
        <PasswordTextBox
          error={errors.password?.message}
          {...register("password", {
            required: "Hasło jest wymagane",
            minLength: { value: 6, message: "Min. 6 znaków" },
          })}
        />
        <PasswordTextBox
          confirmPassword
          error={errors.repeatedPassword?.message}
          {...register("repeatedPassword", {
            required: "Powtórz hasło",
            validate: (value) => value === password || "Hasła nie są takie same",
          })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => setShowCodeInput(e.target.checked)}
            checked={showCodeInput}
          />
          <span className="text-sm">Mam kod specjalny</span>
        </div>
        {showCodeInput && (
          <InputTextBox
            label="Kod"
            type="text"
            placeholder="Wpisz kod specjalny"
            icon={undefined}
            error={errors.specialCode?.message}
            {...register("specialCode")}
          />
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary w-[274px] py-2 border rounded-xl shadow-md"
          >
            Załóż konto
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-center">Masz już konto?</p>
          <button
            type="button"
            className="btn-link self-center text-[12px] cursor-pointer font-bold hover:underline"
            onClick={() => navigate(`/login`)}
          >
            Zaloguj się
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] text-center">
            <h3 className="text-xl font-bold mb-4">Rejestracja zakończona</h3>
            <p className="mb-6">Na Twój adres e-mail został wysłany link do potwierdzenia konta. Proszę sprawdź skrzynkę i kliknij w link.</p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate("/login")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </FormProvider>
  );
};

export default SignUpForm;