import LoginForm from "../components/auth/login-form";
import Layout from "../components/layout/layout";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex justify-center items-center">
      <Layout>
        <div className="flex justify-center items-center min-w-screen min-h-screen">
          <LoginForm />
        </div>
      </Layout>
    </div>
  );
};

export default LoginPage;
