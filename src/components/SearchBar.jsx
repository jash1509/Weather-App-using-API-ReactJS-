import { useState } from 'react';

/**
 * SearchBar Component
 * ───────────────────
 * Renders the search input and button for city lookup.
 * Handles form submission and passes the search query to the parent.
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Callback when the user submits a search
 * @param {boolean} props.isLoading - Whether a search is currently in progress
 */
function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  /**
   * Handles form submission.
   * Prevents default form behavior and triggers the search callback.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="city-search-input"
          className="search-bar__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try Mumbai, Delhi, Bangalore, or any city..."
          aria-label="Enter city name"
          autoComplete="off"
          disabled={isLoading}
        />
        <button
          id="search-btn"
          className="search-bar__btn"
          type="submit"
          disabled={isLoading || !query.trim()}
          aria-label="Search weather"
        >
          <span>{isLoading ? '⏳ Fetching...' : '🔎 Search'}</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
