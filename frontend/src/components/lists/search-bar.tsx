import { ReactSearchAutocomplete } from "react-search-autocomplete";

function SearchBar({
  users,
  onSelectUser,
}: {
  users: any[];
  onSelectUser: (id: string) => void;
}) {
  const items = users.map((user) => ({
    id: user.id,
    name: `${user.name} | ${user.surname} | ${user.email} | ${user.role}`,
  }));

  const handleOnSelect = (item: any) => {
    onSelectUser(item.id);
  };

  return (
    <div className="search-bar-container">
      <ReactSearchAutocomplete
        items={items}
        onSelect={handleOnSelect}
        onClear={() => onSelectUser("")}
        autoFocus
        placeholder="Wyszukaj email"
      />
    </div>
  );
}

export default SearchBar;
