import ChangePasswordForm from "../components/auth/change-password-form";
import Layout from "../components/layout/layout";

const ChangePasswordPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-w-screen min-h-[830px]">
        <ChangePasswordForm />
      </div>
    </Layout>
  );
};

export default ChangePasswordPage;
