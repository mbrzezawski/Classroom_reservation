import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/signup-page";
import LoginPage from "./pages/login-page";

const App = () => {
  // return (
  //   <div
  //     className="flex flex-row gap-6"
  //     style={{
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       height: "100vh",
  //       width: "100vh",
  //     }}
  //   >
  //     <LoginForm />
  //     <SignUpForm />
  //   </div>
  // );
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};

export default App;
