import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useUsers } from '../../hooks/use-users.ts';

function SearchBar() {
    const { users, loading, error } = useUsers();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    // Transform users to match expected format
    const items = users.map(user => ({
        id: user.id,
        name: user.email,  // podpowiedzi są po polu name
        role: user.role
    }));

    console.log(items);

    const handleOnSelect = (item: any) => {
        console.log("Selected:", item);
    };

    return (
        <div className="search-bar-container">
            <ReactSearchAutocomplete
                items={items}
                onSelect={handleOnSelect}
                autoFocus
                placeholder="Search users by email"
            />
        </div>
    );
}

export default SearchBar;
