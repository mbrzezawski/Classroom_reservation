import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/signup-page";
import LoginPage from "./pages/login-page";
import ReservationPage from "./pages/reservation-page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/reserve" element={<ReservationPage />} />
    </Routes>
  );
};

export default App;
