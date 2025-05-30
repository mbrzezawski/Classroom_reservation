import { useState } from "react";
import Layout from "../components/layout/layout.tsx";
import EmployeesList from "../components/lists/employees-list.tsx";
import SearchBar from "../components/lists/search-bar.tsx";
import { useUsers } from "../hooks/use-users.ts";

const EmployeesListPage = () => {
    const { users, loading, error } = useUsers();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const filteredUsers = selectedUserId
        ? users.filter(user => user.id === selectedUserId)
        : users;

    return (
        <Layout>
            <div className="relative min-h-screen gap-4 p-4">
                <div className="flex justify-center p-4 relative z-10">
                    <div className="w-1/2">
                        <SearchBar users={users} onSelectUser={setSelectedUserId} />
                    </div>
                </div>
                <div className="relative z-0">
                    <EmployeesList users={filteredUsers} loading={loading} error={error} />
                </div>
            </div>
        </Layout>
    );
};

export default EmployeesListPage;
