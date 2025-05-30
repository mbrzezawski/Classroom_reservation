import MyCalendar from "../components/calendar/my-calendar";
import Layout from "../components/layout/layout";
import ReservationForm from "../components/reservation/reservation-form";
import SearchBar from "../components/lists/search-bar.tsx";
import {useUsers} from "../hooks/use-users.ts";
import {useState} from "react";
import {useLocation} from "react-router-dom";


const MainPage = () => {

    const userId = "682b8bc9811311363ff183d0"
    const userRole = "TEACHER"

    const location = useLocation();
    const { users } = useUsers();

    const initialUserId = location.state?.userId ?? null;
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const effectiveUserId = selectedUserId ?? initialUserId ?? "";


  return (
    <Layout>
        <div className="grid grid-cols-3 min-h-screen gap-4 p-4">
            <div className="col-span-2 flex flex-col gap-4">
                { userRole === "DEANS_OFFICE" &&
                    (<div className="relative z-10">
                        <SearchBar users={users} onSelectUser={setSelectedUserId} />
                    </div>)
                }
                <div className="relative z-0">
                    <MyCalendar userId={userRole === "DEANS_OFFICE" ? effectiveUserId : userId} />
                </div>
            </div>
            <ReservationForm/>
        </div>
    </Layout>
  );
};

export default MainPage;
