import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";

const ReservationPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <ReservationForm />
      </div>
    </Layout>
  );
};

export default ReservationPage;
