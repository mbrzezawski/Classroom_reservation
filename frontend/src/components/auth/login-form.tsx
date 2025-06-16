import { FormProvider, useForm } from "react-hook-form";
import InputTextBox from "../ui/input-textbox";
import PasswordTextBox from "./password-textbox";
import AtIcon from "../icons/at";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";
import { API_URL } from "../../api";
type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const methods = useForm({
    defaultValues: { email: "", password: "" },
  });
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nieprawidłowe dane logowania");
      }

      const { token } = await response.json();
      await login(token);
      navigate("/main");
    } catch (err: any) {
      console.error("Błąd logowania:", err.message);
      alert(err.message);
    }
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
        className="flex flex-col bg-base-100 border border-base-300 shadow-lg w-[380px]  px-6 py-8 gap-[30px] rounded-[8px]"
      >
        <h2 className="text-3xl font-bold text-center">Zaloguj się</h2>

        <InputTextBox
          label="Email"
          type="email"
          placeholder="Type your email"
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

        <div className="w-full">
          <PasswordTextBox
            error={errors.password?.message}
            {...register("password", { required: "Hasło jest wymagane" })}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary w-[274px] py-2 border rounded-xl shadow-md"
          >
            Zaloguj się
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-center">Nie masz konta?</p>
          <button
            type="button"
            className="flex self-center btn-link no-underline cursor-pointer text-[12px] font-bold hover:underline"
            onClick={() => navigate(`/signup`)}
          >
            Stwórz konto
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
