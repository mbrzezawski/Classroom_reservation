import {useNavigate} from "react-router-dom";
import Delete from "../icons/delete.tsx";
import {deleteUser} from "../../hooks/del-user.ts"




const EmployeesList = ({ users, loading, error }: { users: any[], loading: boolean, error: any }) => {

    const navigate = useNavigate()

    function handleClick(userId: number) {
        navigate(`/main`, {state: {userId}})
    }

    function handleDelete(id: number) {
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(id)
                .then(() => alert("User deleted"))
                .catch(err => console.error("Delete failed", err));
        }
    }

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    if (users.length === 0) return <div className="p-4">No users found.</div>;

    return (
        <div className="p-4 flex justify-center">
            <div className="border border-base-content/10 rounded-lg overflow-hidden">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role === "TEACHER" && (
                                    <button className="btn" onClick={() => handleClick(user.id)}>
                                        Go to calendar
                                    </button>
                                )}
                                <button className="btn" onClick={() => handleDelete(user.id)}>
                                    <Delete ></Delete>
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

export default EmployeesList;
