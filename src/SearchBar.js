function SearchBar({ searchQuery, onSearchChange }) {
    return (
        <div className='search'>
            <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}  // Updating search query
                className='search_btn'
            />
        </div>
    );
}

export default SearchBar;