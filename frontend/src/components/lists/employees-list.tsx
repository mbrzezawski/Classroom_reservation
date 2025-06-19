import { useNavigate } from "react-router-dom";
import Delete from "../icons/delete.tsx";
import { deleteUser } from "../../hooks/del-user.ts";
import { useAuth } from "../../auth/auth-context.tsx";
import showToast from "../../hooks/show-toast.ts";

const EmployeesList = ({
  users,
  loading,
  error,
}: {
  users: any[];
  loading: boolean;
  error: any;
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  if (!token) {
    return;
  }

  function handleClick(userId: number) {
    navigate(`/main`, { state: { userId } });
  }

  function handleDelete(id: number) {
    if (confirm("Czy na pewno usunąć użytkownika?")) {
      deleteUser(id, token)
        .then(() => showToast("Użytkownik usunięto", { variant: "success" }))
        .catch((err) =>
          showToast("Usuwanie nie powiodło się", { variant: "destructive" })
        );
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (users.length === 0)
    return <div className="p-4">Nie znaleziono użytkownika.</div>;

  return (
    <div className="p-4 flex justify-center ">
      <div className="border border-base-content/10 rounded-lg overflow-hidden">
        <table className="table w-full bg-base-200 shadow-xs">
          <thead>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className="flex gap-2">
                    {user.role === "TEACHER" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleClick(user.id)}
                      >
                        Przejdź do kalendarza
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesList;
