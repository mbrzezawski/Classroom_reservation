import Layout from "../components/layout/layout.tsx";
import ClassList from "../components/lists/class-list.tsx";
import {useRooms} from "../hooks/use-rooms.ts";




const ClassListPage = () => {

    const { rooms, loading, error } = useRooms();

    return (
        <Layout>
            <div className="relative min-h-screen gap-4 p-4">
                <div className="flex justify-center p-4 relative z-10">
                    <ClassList rooms={rooms} loading={loading} error={error} />
                </div>
            </div>
        </Layout>
    );
};

export default ClassListPage;
