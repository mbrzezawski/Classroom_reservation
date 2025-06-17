import { useState } from "react";
import Layout from "../components/layout/layout.tsx";
import EmployeesList from "../components/lists/employees-list.tsx";
import SearchBar from "../components/lists/search-bar.tsx";
import { useUsers } from "../hooks/use-users.ts";
import Plus from "../components/icons/plus.tsx";
import AddNewEmployeeForm from "../components/lists/add-new-employee-form.tsx";
import ArrowDown from "../components/icons/arrow-down.tsx";

const EmployeesListPage = () => {
  const { users, loading, error } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  //   const [showAddNewEmployeeForm, setShowAddNewEmployeeForm] = useState(false);

  const filteredUsers = selectedUserId
    ? users.filter((user) => user.id === selectedUserId)
    : users;

  return (
    <Layout>
      <div className="relative min-h-screen gap-4 p-4">
        <div className="flex justify-center p-4 relative z-10 gap-4">
          <div className="flex flex-1 items-center gap-2 max-w-2xl">
            <div className="flex-grow">
              <SearchBar users={users} onSelectUser={setSelectedUserId} />
            </div>
            {/* <div className="flex-shrink-0">
                            {!showAddNewEmployeeForm && <button
                                onClick={() =>
                                    setShowAddNewEmployeeForm(true)
                                }
                                className="btn p-2">
                                <Plus/> </button>}
                            {showAddNewEmployeeForm && <button
                                onClick={() =>
                                    setShowAddNewEmployeeForm(false)
                                }
                                className="btn p-2">
                                <ArrowDown/> </button>}
                        </div> */}
          </div>
        </div>

        <div className="relative z-0">
          {/* {showAddNewEmployeeForm && <AddNewEmployeeForm />} */}
          <EmployeesList
            users={filteredUsers}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EmployeesListPage;
