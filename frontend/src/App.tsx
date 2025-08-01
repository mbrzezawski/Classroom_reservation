import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/signup-page";
import LoginPage from "./pages/login-page";
import MainPage from "./pages/main-page";
import EmployeesListPage from "./pages/employees-list-page.tsx";
import ClassListPage from "./pages/class-list-page.tsx";
import ProposalLIstPage from "./pages/proposal-list-page.tsx";
import ChangePasswordPage from "./pages/change-password-page.tsx";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/employees" element={<EmployeesListPage />} />
        <Route path="/rooms" element={<ClassListPage />} />
        <Route
          path="/proposals"
          element={<ProposalLIstPage></ProposalLIstPage>}
        />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};

export default App;
