import LoginForm from "../components/auth/login-form";
import Layout from "../components/layout/layout";

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-8 ">
      <Layout>
        <div className="flex justify-center items-center min-w-screen min-h-screen">
          <LoginForm />
        </div>
      </Layout>
    </div>
  );
};

export default LoginPage;
