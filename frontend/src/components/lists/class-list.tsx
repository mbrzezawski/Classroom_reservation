import {useEquipment, useSoftware} from "../../hooks/use-room-features.ts";
import Delete from "../icons/delete.tsx";
import {deleteRoom} from "../../hooks/del-room.ts"


const ClassList = ({ rooms, loading, error }: { rooms: any[], loading: boolean, error: any }) => {

    const roomEquipment = useEquipment();
    const roomSoftware = useSoftware();

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    if (rooms.length === 0) return <div className="p-4">No users found.</div>;

    const equipmentDict = Object.fromEntries(
        roomEquipment.map((item) => [item.value, item.label])
    );

    const softwareDict = Object.fromEntries(
        roomSoftware.map((item) => [item.value, item.label])
    );

    function handleDelete(id: number) {
        if (confirm("Are you sure you want to delete this room?")) {
            deleteRoom(id)
                .then(() => alert("Room deleted"))
                .catch(err => console.error("Delete failed", err));
        }
    }

    return (
        <div className="p-4 flex justify-center">
            <div className="border border-base-content/10 rounded-lg overflow-hidden">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Software</th>
                        <th>Equipment</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map(room => (
                        <tr key={room.id}>
                            <td>{room.name}</td>
                            <td>{room.capacity}</td>
                            <td>
                                {(room.softwareIds || []).map((id: string) => (
                                    <span key={id} className="badge badge-outline mr-1">
                                        {softwareDict[id] || id}
                                    </span>
                                ))}
                            </td>
                            <td>
                                {(room.equipmentIds || []).map((id: string) => (
                                <span key={id} className="badge badge-outline mr-1">
                                    {equipmentDict[id] || id}
                                </span>
                                ))}
                            </td>
                            <td>{room.location}</td>
                            <td>
                                <button className="btn" onClick={() => handleDelete(room.id)}>
                                    <Delete></Delete>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassList;
