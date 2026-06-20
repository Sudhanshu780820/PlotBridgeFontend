const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by city or location"
      />

      <button>Search</button>
    </div>
  );
};

export default SearchBar;