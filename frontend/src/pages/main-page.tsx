import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";
import { Toaster } from "sonner";
import useCalendarEvents from "../hooks/use-calendar-events";

const MainPage = () => {
  const userId = "682b8bc9811311363ff183d0";
  const { events, dispatch } = useCalendarEvents(userId);

  return (
    <Layout>
      <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
        <div className="col-span-2">
          <MyCalendar events={events} />
        </div>
        <ReservationForm userId={userId} dispatch={dispatch} />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </Layout>
  );
};

export default MainPage;
