import {useEquipment, useSoftware} from "../../hooks/use-room-features.ts";


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
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassList;
