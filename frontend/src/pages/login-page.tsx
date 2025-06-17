import LoginForm from "../components/auth/login-form";
import Layout from "../components/layout/layout";

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-w-screen min-h-[830px]">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
