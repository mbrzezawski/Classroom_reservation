import ChangePasswordForm from "../components/auth/change-password-form";
import Layout from "../components/layout/layout";

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col gap-8 ">
      <Layout>
        <div className="flex justify-center items-center min-w-screen min-h-screen">
          <ChangePasswordForm />
        </div>
      </Layout>
    </div>
  );
};

export default ChangePasswordPage;
