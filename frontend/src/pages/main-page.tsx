import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";

const MainPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
        <div className="col-span-2">
          <MyCalendar userId="682b8bc9811311363ff183d0" />
        </div>
        <ReservationForm />
      </div>
    </Layout>
  );
};

export default MainPage;
