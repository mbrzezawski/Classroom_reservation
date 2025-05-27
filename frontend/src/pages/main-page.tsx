import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";
import SearchBar from "../components/lists/search-bar.tsx";
import {useUsers} from "../hooks/use-users.ts";
import {useState} from "react";


const MainPage = () => {

    const { users, loading, error } = useUsers();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <Layout>
        <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
            <div className="col-span-2 flex flex-col gap-4">
                <div className="relative z-10">
                    <SearchBar users={users} onSelectUser={setSelectedUserId} />
                </div>
                <div className="relative z-0">
                    <MyCalendar userId={selectedUserId ?? ""} />
                </div>
            </div>
            <ReservationForm/>
        </div>
    </Layout>
  );
};

export default MainPage;
