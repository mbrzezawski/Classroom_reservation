import { ReactSearchAutocomplete } from 'react-search-autocomplete';

function SearchBar({ users, onSelectUser }: { users: any[], onSelectUser: (id: string) => void }) {

    const items = users.map(user => ({
        id: user.id,
        name: `${user.email} | ${user.role}`,  // TODO: Można dodać też imię i nazwisko
    }));

    const handleOnSelect = (item: any) => {
        console.log("Selected:", item);
        onSelectUser(item.id);
    };

    return (
        <div className="search-bar-container">
            <ReactSearchAutocomplete
                items={items}
                onSelect={handleOnSelect}
                onClear={() => onSelectUser("")}
                autoFocus
                placeholder="Search users"
            />
        </div>
    );
}

export default SearchBar;
