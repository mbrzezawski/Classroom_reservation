import SignUpForm from "../components/auth/sign-up-form";
import Layout from "../components/layout/layout";

const SignUpPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <SignUpForm />
      </div>
    </Layout>
  );
};

export default SignUpPage;
