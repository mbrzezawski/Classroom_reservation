import Layout from "../components/layout/layout.tsx";
import EmployeesList from "../components/lists/employees-list.tsx"
import SearchBar from "../components/lists/search-bar.tsx";


const EmployeesListPage = () => {


    return (
        <Layout>
            <div className="min-h-screen gap-4 p-4">
                <div className="flex justify-center p-4">
                    <div className="w-1/2">
                        <SearchBar />
                    </div>
                </div>
                <EmployeesList />
            </div>
        </Layout>
    );
};

export default EmployeesListPage;
