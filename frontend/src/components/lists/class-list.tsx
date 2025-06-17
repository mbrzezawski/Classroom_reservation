import { useEquipment, useSoftware } from "../../hooks/use-room-features.ts";
import Delete from "../icons/delete.tsx";
import { deleteRoom } from "../../hooks/del-room.ts";
import { useAuth } from "../../auth/auth-context.tsx";
import showToast from "../../hooks/show-toast.ts";

const ClassList = ({
  rooms,
  loading,
  error,
}: {
  rooms: any[];
  loading: boolean;
  error: any;
}) => {
  const roomEquipment = useEquipment();
  const roomSoftware = useSoftware();
  const { token } = useAuth();
  if (!token) {
    return;
  }

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
    if (confirm("Czy na pewno usunąć salę?")) {
      deleteRoom(id, token)
        .then(() => showToast("Sala usunięta", { variant: "success" }))
        .catch((err) =>
          showToast("Usuwanie nie powiodło się", { variant: "destructive" })
        );
    }
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="border border-base-content/10 rounded-lg overflow-hidden">
        <table className="table w-full bg-base-200">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Pojemność</th>
              <th>Oprogramowanie</th>
              <th>Wyposażenie</th>
              <th>Lokacja</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
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
