import LoginForm from "./components/auth/login-form";
import SignUpForm from "./components/auth/sign-up-form";

function App() {
  return (
    <div
      className="flex flex-row gap-6"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vh",
      }}
    >
      <LoginForm />
      <SignUpForm />
    </div>
  );
}

export default App;
