import { useState } from "react";
import Layout from "../components/layout/layout.tsx";
import ClassList from "../components/lists/class-list.tsx";
import { useRooms } from "../hooks/use-rooms.ts";
import Plus from "../components/icons/plus.tsx";
import ArrowDown from "../components/icons/arrow-down.tsx";
import AddNewRoomForm from "../components/lists/add-new-room-form.tsx";

const ClassListPage = () => {
    const { rooms, loading, error } = useRooms();
    const [showAddNewRoomForm, setShowAddNewRoomForm] = useState(false);

    return (
        <Layout>
            <div className="relative min-h-screen gap-4 p-4">
                <div className="flex justify-center p-4 relative z-10 gap-4">
                    <div className="flex flex-1 items-center gap-2 max-w-2xl justify-end">
                        {!showAddNewRoomForm ? (
                            <button
                                onClick={() => setShowAddNewRoomForm(true)}
                                className="btn p-2"
                            >
                                <Plus />
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowAddNewRoomForm(false)}
                                className="btn p-2"
                            >
                                <ArrowDown />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative z-0">
                    {showAddNewRoomForm && <AddNewRoomForm />}
                    <ClassList rooms={rooms} loading={loading} error={error} />
                </div>
            </div>
        </Layout>
    );
};

export default ClassListPage;
