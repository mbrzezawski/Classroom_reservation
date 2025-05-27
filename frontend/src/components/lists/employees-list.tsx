const EmployeesList = ({ users, loading, error }: { users: any[], loading: boolean, error: any }) => {
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
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeesList;
